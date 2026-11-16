import type { Mention } from '#shared/types/guestbook'

// Owner only: DELETE /api/mentions?source=<address> with "Authorization: Bearer <token>".
export default defineEventHandler(async (event) => {
  requireOwner(event)
  const source = String(getQuery(event).source ?? '')
  const left = await updateList<Mention>('mentions', (list) => list.filter((mention) => mention.source !== source))
  return { remaining: left.length }
})
