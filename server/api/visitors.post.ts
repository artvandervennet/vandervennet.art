import { getSolidDataset, getStringNoLocale, getThing, getThingAll } from '@inrupt/solid-client'
import type { Visitor } from '#shared/types/guestbook'

const VCARD_FN = 'http://www.w3.org/2006/vcard/ns#fn'

// A visitor leaves their Solid WebID. We read the profile once to check it is a real one
// with a vCard name (the card on the page needs it), and store only the address and that name.
export default defineEventHandler(async (event) => {
  limitWrites(event, 'visitors')
  const body = await readBody<{ webid?: unknown }>(event)
  const webid = parsePublicUrl(body?.webid, 'Your WebID')

  // the Solid client fetches the profile through the guarded fetch, like everything else here
  const guarded: typeof fetch = (input, init) => safeFetch(input, init)
  const dataset = await getSolidDataset(webid.href, { fetch: guarded }).catch(() => {
    throw createError({ statusCode: 400, statusMessage: 'Could not read a Solid profile at that address. Check that it is your WebID and that the profile is public.' })
  })
  const profile = getThing(dataset, webid.href)
    ?? getThing(dataset, `${webid.href.split('#')[0]}#me`)
    ?? getThingAll(dataset).find((thing) => getStringNoLocale(thing, VCARD_FN))
  const name = profile && getStringNoLocale(profile, VCARD_FN)
  if (!name) {
    throw createError({ statusCode: 400, statusMessage: 'That profile has no vCard name (vcard:fn), which the card needs. Add one to your profile and try again.' })
  }

  const visitor: Visitor = { webid: webid.href, name: name.slice(0, 80), addedAt: new Date().toISOString() }
  await updateList<Visitor>('visitors', (list) =>
    list.some((existing) => existing.webid === visitor.webid) ? list : [visitor, ...list].slice(0, 200))
  if (backToGuestbook(event)) return
  setResponseStatus(event, 201)
  return visitor
})
