import type { Visitor } from '#shared/types/guestbook'

// Owner only: DELETE /api/visitors?webid=<address> with "Authorization: Bearer <token>".
export default defineEventHandler(async (event) => {
  requireOwner(event)
  const webid = String(getQuery(event).webid ?? '')
  const left = await updateList<Visitor>('visitors', (list) => list.filter((visitor) => visitor.webid !== webid))
  return { remaining: left.length }
})
