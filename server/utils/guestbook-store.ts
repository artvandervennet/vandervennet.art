// The guestbook's storage: two JSON lists in a folder on disk (see nitro.storage in nuxt.config.ts).
// Writes to the same list wait for each other, so two visitors at once can't lose an entry.

const queues = new Map<string, Promise<unknown>>()

export async function readList<T>(key: string): Promise<T[]> {
  return (await useStorage('guestbook').getItem<T[]>(key)) ?? []
}

export function updateList<T>(key: string, change: (list: T[]) => T[]): Promise<T[]> {
  const previous = queues.get(key) ?? Promise.resolve()
  const next = previous.then(async () => {
    const updated = change(await readList<T>(key))
    await useStorage('guestbook').setItem(key, updated)
    return updated
  })
  queues.set(key, next.catch(() => {}))
  return next
}

// A simple limit on how often one address can write: both lists are open to the world.
const recent = new Map<string, number[]>()

export function limitWrites(event: Parameters<typeof getRequestIP>[0], list: string, perMinute = 6) {
  const who = `${list} ${getRequestIP(event, { xForwardedFor: true }) ?? 'unknown'}`
  const now = Date.now()
  const times = (recent.get(who) ?? []).filter((time) => now - time < 60_000)
  if (times.length >= perMinute) {
    throw createError({ statusCode: 429, statusMessage: 'That is a lot at once. Try again in a minute.' })
  }
  times.push(now)
  recent.set(who, times)
}

/**
 * A form posted without JavaScript expects a page back, not JSON: send the visitor back to the
 * guestbook. The page's own script asks for JSON and gets the entry.
 */
export function backToGuestbook(event: Parameters<typeof getRequestHeader>[0]): boolean {
  const accept = getRequestHeader(event, 'accept') ?? ''
  if (!accept.includes('text/html')) return false
  void sendRedirect(event, '/#guestbook', 303)
  return true
}

/** Deleting entries is for the owner: it needs the token from NUXT_ADMIN_TOKEN. */
export function requireOwner(event: Parameters<typeof getRequestHeader>[0]) {
  const token = useRuntimeConfig(event).adminToken
  if (!token || getRequestHeader(event, 'authorization') !== `Bearer ${token}`) {
    throw createError({ statusCode: 403, statusMessage: 'Only the owner can delete entries.' })
  }
}
