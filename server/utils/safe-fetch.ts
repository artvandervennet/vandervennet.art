import { lookup } from 'node:dns/promises'
import { isIP } from 'node:net'

// The guestbook fetches addresses that strangers hand it. These helpers keep that from being
// turned against the Pi's own network: only http(s), only public addresses, every redirect
// checked again, a time limit and a size limit.

const TIMEOUT_MS = 8000
const MAX_REDIRECTS = 4
const MAX_BYTES = 1_000_000

function isPrivateAddress(ip: string): boolean {
  if (ip.includes(':')) {
    const v6 = ip.toLowerCase()
    if (v6.startsWith('::ffff:')) return isPrivateAddress(v6.slice(7))
    return v6 === '::1' || v6 === '::' || v6.startsWith('fc') || v6.startsWith('fd') || v6.startsWith('fe80')
  }
  const [a = 0, b = 0] = ip.split('.').map(Number)
  return a === 0 || a === 10 || a === 127
    || (a === 169 && b === 254)
    || (a === 172 && b >= 16 && b <= 31)
    || (a === 192 && b === 168)
    || (a === 100 && b >= 64 && b <= 127)
}

/** Parse an address someone typed, or fail with a message they can act on. */
export function parsePublicUrl(value: unknown, what: string): URL {
  let url: URL
  try {
    url = new URL(String(value ?? '').trim())
  }
  catch {
    throw createError({ statusCode: 400, statusMessage: `${what} is not a valid address. It should start with https://` })
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    throw createError({ statusCode: 400, statusMessage: `${what} must be an http or https address.` })
  }
  return url
}

async function assertPublic(url: URL) {
  // In development, mentions and profiles from this machine are how you test.
  if (import.meta.dev) return
  const host = url.hostname.replace(/^\[|\]$/g, '')
  const addresses = isIP(host) ? [host] : (await lookup(host, { all: true }).catch(() => [])).map((entry) => entry.address)
  if (!addresses.length || addresses.some(isPrivateAddress)) {
    throw createError({ statusCode: 400, statusMessage: `${url.hostname} is not a public address.` })
  }
}

/** fetch() for addresses supplied by visitors. Same signature as fetch. */
export async function safeFetch(input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> {
  let url = new URL(input instanceof Request ? input.url : String(input))
  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    await assertPublic(url)
    const response = await fetch(url, { ...init, redirect: 'manual', signal: AbortSignal.timeout(TIMEOUT_MS) })
    const location = response.headers.get('location')
    if (response.status >= 300 && response.status < 400 && location) {
      url = new URL(location, url)
      continue
    }
    return response
  }
  throw createError({ statusCode: 400, statusMessage: 'That address redirects too many times.' })
}

/** The body as text, cut off at a megabyte. */
export async function readLimited(response: Response): Promise<string> {
  const reader = response.body?.getReader()
  if (!reader) return ''
  const chunks: Uint8Array[] = []
  let size = 0
  while (size < MAX_BYTES) {
    const { done, value } = await reader.read()
    if (done) break
    chunks.push(value)
    size += value.byteLength
  }
  await reader.cancel().catch(() => {})
  return new TextDecoder().decode(Buffer.concat(chunks).subarray(0, MAX_BYTES))
}
