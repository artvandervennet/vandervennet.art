// What the guestbook stores and sends to the page.

export type MentionType = 'reply' | 'like' | 'repost' | 'bookmark' | 'mention'

/** A webmention: another page that links to this site. */
export interface Mention {
  /** The page that mentions us. */
  source: string
  /** The page of ours it links to. */
  target: string
  type: MentionType
  author: { name: string, url?: string, photo?: string }
  /** Title of the source post, when it has one. */
  title?: string
  /** A plain-text excerpt of what it says. */
  content?: string
  /** When the source says it was published. */
  published?: string
  receivedAt: string
}

/** A visitor who left their Solid WebID. Only the address is ours; the card is read from their pod. */
export interface Visitor {
  webid: string
  name: string
  addedAt: string
}
