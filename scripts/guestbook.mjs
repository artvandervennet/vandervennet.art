#!/usr/bin/env node
// Look at the guestbook and take entries out of it.
//
//   node scripts/guestbook.mjs                      what is in it now
//   node scripts/guestbook.mjs remove <address>     take one entry out
//
// <address> is the first thing on an entry's line in the list: the address of the post for a
// webmention, the WebID for a Solid card. Removing needs the owner's token, the value of
// NUXT_ADMIN_TOKEN on the server. Give it for this one command, so it is never saved anywhere:
//
//   NUXT_ADMIN_TOKEN=… node scripts/guestbook.mjs remove https://example.com/a-post
//
// GUESTBOOK_SITE points it at another copy of the site, e.g. http://localhost:3000.

const site = (process.env.GUESTBOOK_SITE ?? 'https://vandervennet.art').replace(/\/$/, '')
const [command = 'list', address] = process.argv.slice(2)

async function get(list) {
  const response = await fetch(`${site}/api/${list}`)
  if (!response.ok) throw new Error(`${site}/api/${list} answered ${response.status}`)
  return response.json()
}

const mentions = await get('mentions')
const visitors = await get('visitors')

if (command === 'list') {
  console.log(`Webmentions (${mentions.length})`)
  for (const mention of mentions) {
    console.log(`  ${mention.source}`)
    console.log(`      ${mention.type} by ${mention.author?.name ?? 'someone'}, received ${mention.receivedAt.slice(0, 10)}`)
    if (mention.content) console.log(`      "${mention.content.slice(0, 100)}"`)
  }
  console.log(`\nSolid cards (${visitors.length})`)
  for (const visitor of visitors) {
    console.log(`  ${visitor.webid}`)
    console.log(`      ${visitor.name}, added ${visitor.addedAt.slice(0, 10)}`)
  }
} else if (command === 'remove' && address) {
  const token = process.env.NUXT_ADMIN_TOKEN
  if (!token) {
    console.error('Removing needs the token: NUXT_ADMIN_TOKEN=… node scripts/guestbook.mjs remove <address>')
    process.exit(2)
  }
  const isMention = mentions.some((mention) => mention.source === address)
  const isVisitor = visitors.some((visitor) => visitor.webid === address)
  if (!isMention && !isVisitor) {
    console.error(`Nothing in the guestbook has the address ${address}. Run it without arguments to see the list.`)
    process.exit(1)
  }
  for (const [list, key, found] of [['mentions', 'source', isMention], ['visitors', 'webid', isVisitor]]) {
    if (!found) continue
    const response = await fetch(`${site}/api/${list}?${new URLSearchParams({ [key]: address })}`, {
      method: 'DELETE',
      headers: { authorization: `Bearer ${token}` },
    })
    if (response.status === 403) {
      console.error('The site refused the token. It has to be the value of NUXT_ADMIN_TOKEN on the server.')
      process.exit(1)
    }
    if (!response.ok) throw new Error(`${site} answered ${response.status}`)
    console.log(`Removed from ${list === 'mentions' ? 'the webmentions' : 'the Solid cards'}. ${(await response.json()).remaining} left. The page shows it within a minute.`)
  }
} else {
  console.error('Usage: node scripts/guestbook.mjs [list | remove <address>]')
  process.exit(2)
}
