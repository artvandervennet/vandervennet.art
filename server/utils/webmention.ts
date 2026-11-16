import { mf2 } from 'microformats-parser'
import type { Mention, MentionType } from '#shared/types/guestbook'

// Reading a webmention's source page: does it really link to us, and what does its
// microformats markup say about who wrote it and what kind of mention it is?

type Mf2Item = { type?: string[], properties: Record<string, unknown[]>, value?: string, children?: Mf2Item[] }

const sameAddress = (a: string, b: string) => a.replace(/\/$/, '') === b.replace(/\/$/, '')

/** Every address the page links to or embeds, resolved against the page's own address. */
export function linksIn(html: string, base: string): string[] {
  const found: string[] = []
  for (const match of html.matchAll(/\s(?:href|src)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gi)) {
    try {
      found.push(new URL((match[1] ?? match[2] ?? match[3] ?? '').replace(/&amp;/g, '&'), base).href)
    }
    catch { /* not an address */ }
  }
  return found
}

export const linksTo = (html: string, base: string, target: string) =>
  linksIn(html, base).some((link) => sameAddress(link, target))

const first = (values: unknown[] | undefined): unknown => values?.[0]
const text = (value: unknown): string | undefined =>
  typeof value === 'string' ? value : (value as { value?: string } | undefined)?.value
const clip = (value: string | undefined, length: number) => {
  const clean = value?.replace(/\s+/g, ' ').trim()
  return clean && clean.length > length ? `${clean.slice(0, length - 1).trimEnd()}…` : clean || undefined
}
const httpUrl = (value: unknown): string | undefined => {
  const address = text(value)
  return address && /^https?:\/\//.test(address) ? address : undefined
}

function findEntry(items: Mf2Item[]): Mf2Item | undefined {
  for (const item of items) {
    if (item.type?.includes('h-entry')) return item
    const nested = findEntry(item.children ?? [])
    if (nested) return nested
  }
}

/** Which property of the entry points at us decides what kind of mention it is. */
function typeOf(entry: Mf2Item | undefined, target: string): MentionType {
  const kinds: [string, MentionType][] = [['in-reply-to', 'reply'], ['like-of', 'like'], ['repost-of', 'repost'], ['bookmark-of', 'bookmark']]
  for (const [property, type] of kinds) {
    const values = (entry?.properties[property] ?? []).map((value) => text(value) ?? first((value as Mf2Item).properties?.url) as string)
    if (values.some((value) => typeof value === 'string' && sameAddress(value, target))) return type
  }
  return 'mention'
}

export function describeMention(html: string, source: string, target: string): Omit<Mention, 'receivedAt'> {
  const { items } = mf2(html, { baseUrl: source }) as unknown as { items: Mf2Item[] }
  const entry = findEntry(items)
  // the author is the entry's own h-card, or else the page's
  const card = (first(entry?.properties.author) as Mf2Item | string | undefined)
    ?? items.find((item) => item.type?.includes('h-card'))
  const author = typeof card === 'string'
    ? { name: card }
    : {
        name: text(first(card?.properties.name)) ?? '',
        url: httpUrl(first(card?.properties.url)),
        photo: httpUrl(first(card?.properties.photo)),
      }
  const title = html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]

  return {
    source,
    target,
    type: typeOf(entry, target),
    author: { ...author, name: clip(author.name, 80) ?? new URL(source).hostname },
    title: clip(text(first(entry?.properties.name)) ?? title, 120),
    content: clip(text(first(entry?.properties.content)) ?? text(first(entry?.properties.summary)), 280),
    published: text(first(entry?.properties.published)),
  }
}
