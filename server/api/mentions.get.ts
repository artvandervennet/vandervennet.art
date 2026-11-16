import type { Mention } from '#shared/types/guestbook'

export default defineEventHandler(() => readList<Mention>('mentions'))
