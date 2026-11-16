import type { Visitor } from '#shared/types/guestbook'

export default defineEventHandler(() => readList<Visitor>('visitors'))
