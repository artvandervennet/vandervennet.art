#!/usr/bin/env node
// Tells another site that a page of this one links to it: a webmention
// (https://www.w3.org/TR/webmention/). The other site decides what it does with that.
//
//   node scripts/send-webmention.mjs <their page> [my page]
//   node scripts/send-webmention.mjs https://michielvandevelde.com/
//
// "My page" is https://vandervennet.art/ unless you give another. It has to be online and
// contain a link to their page, because their site will come and look.
// A site has to say where it takes webmentions. If it doesn't, there is nowhere to send one,
// and this says so.

const [target, source = 'https://vandervennet.art/'] = process.argv.slice(2)
if (!target) {
  console.error('Usage: node scripts/send-webmention.mjs <their page> [my page]')
  process.exit(2)
}

const agent = { 'user-agent': 'webmention-sender' }

/** rel values and href of every <link> and <a> in a page, in document order. */
function links(html) {
  return [...html.matchAll(/<(?:link|a)\b[^>]*>/gi)].map(([tag]) => ({
    rel: (tag.match(/\brel\s*=\s*["']?([^"'>]*)/i)?.[1] ?? '').toLowerCase().split(/\s+/),
    href: tag.match(/\bhref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]*))/i)?.slice(1).find((v) => v !== undefined),
  }))
}

/** Where the target takes webmentions: its Link header first, then the first link in its HTML. */
async function endpointOf(url) {
  const response = await fetch(url, { headers: agent, redirect: 'follow' })
  if (!response.ok) throw new Error(`${url} answered ${response.status}`)
  for (const part of (response.headers.get('link') ?? '').split(',')) {
    const [, href, params = ''] = part.match(/<([^>]*)>(.*)/) ?? []
    if (href !== undefined && /\brel\s*=\s*"?[^";]*\bwebmention\b/i.test(params)) return new URL(href, response.url).href
  }
  if (!(response.headers.get('content-type') ?? '').includes('html')) return null
  const found = links(await response.text()).find((link) => link.rel.includes('webmention') && link.href !== undefined)
  return found ? new URL(found.href, response.url).href : null
}

// their site will check that my page really links to theirs, so check it first
const page = await fetch(source, { headers: agent })
if (!page.ok) {
  console.error(`My page ${source} answered ${page.status}. It has to be online first.`)
  process.exit(1)
}
const mine = links(await page.text())
if (!mine.some((link) => link.href && new URL(link.href, source).href === new URL(target).href)) {
  console.error(`${source} has no link to ${target}. Add the link, publish, and run this again.`)
  process.exit(1)
}

const endpoint = await endpointOf(target)
if (!endpoint) {
  console.log(`${target} does not say where it takes webmentions, so there is nowhere to send one.`)
  console.log(`The link on ${source} is there. Run this again when their site supports webmentions.`)
  process.exit(0)
}

const sent = await fetch(endpoint, {
  method: 'POST',
  headers: { ...agent, 'content-type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({ source, target }),
})
const answer = (await sent.text()).trim().slice(0, 300)
if (sent.status >= 200 && sent.status < 300) {
  console.log(`Sent to ${endpoint}. They answered ${sent.status}${answer ? `: ${answer}` : ''}`)
  if (sent.headers.get('location')) console.log(`Follow it at ${sent.headers.get('location')}`)
} else {
  console.error(`${endpoint} refused it with ${sent.status}${answer ? `: ${answer}` : ''}`)
  process.exit(1)
}
