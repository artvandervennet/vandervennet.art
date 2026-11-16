import type { Mention } from '#shared/types/guestbook'

// The webmention endpoint (https://www.w3.org/TR/webmention/). Another site posts
// source=<their page>&target=<our page>. We fetch their page, check it really links to us,
// read who wrote it and what kind of mention it is, and keep it.
// Sending the same source again updates it; if the link is gone, the mention is removed.
export default defineEventHandler(async (event) => {
  limitWrites(event, 'mentions', 20)
  const body = await readBody<Record<string, unknown>>(event)
  const source = parsePublicUrl(body?.source, 'The address of your post')
  const target = parsePublicUrl(body?.target, 'The target')

  const ours = [new URL(useRuntimeConfig(event).public.siteUrl).host, getRequestURL(event).host]
  if (!ours.includes(target.host)) {
    throw createError({ statusCode: 400, statusMessage: 'The target is not a page on this site.' })
  }
  if (source.href === target.href) {
    throw createError({ statusCode: 400, statusMessage: 'A page cannot mention itself.' })
  }

  const response = await safeFetch(source, { headers: { accept: 'text/html, */*;q=0.1' } })
    .catch((error) => { throw createError({ statusCode: 400, statusMessage: error?.statusMessage ?? 'Could not reach that page.' }) })
  const html = response.ok ? await readLimited(response) : ''
  const stillLinks = response.ok && linksTo(html, source.href, target.href)
  const same = (mention: Mention) => mention.source === source.href && mention.target === target.href

  if (!stillLinks) {
    const before = await readList<Mention>('mentions')
    if (before.some(same)) {
      await updateList<Mention>('mentions', (list) => list.filter((mention) => !same(mention)))
      return { status: 'removed' }
    }
    throw createError({
      statusCode: 400,
      statusMessage: response.ok ? `That page does not link to ${target.href}` : `That page answered with an error (${response.status}).`,
    })
  }

  const mention: Mention = { ...describeMention(html, source.href, target.href), receivedAt: new Date().toISOString() }
  await updateList<Mention>('mentions', (list) => [mention, ...list.filter((existing) => !same(existing))].slice(0, 500))
  if (backToGuestbook(event)) return
  setResponseStatus(event, 201)
  return { status: 'accepted', mention }
})
