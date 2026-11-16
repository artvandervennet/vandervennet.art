# vandervennet.art

The portfolio of Art Van der Vennet. One prerendered page, built with Nuxt 4 and painted with [Gesso](https://github.com/artvandervennet/gesso).

## Run it

```sh
pnpm install    # needs SSH access to the private Gesso repository
pnpm dev        # http://localhost:3000
pnpm build      # the server that renders the page and runs the guestbook, in .output
pnpm start      # run that build: node .output/server/index.mjs
pnpm typecheck
```

## Where things are

| Path | What |
|---|---|
| `app/data/` | Everything the page says: `site.ts`, `timeline.ts`, `projects.ts`, `interests.ts`. |
| `app/components/` | One component per part of the page. `PageSection` is a painted band; `SectionHeading` renders a heading at the level its nesting adds up to. |
| `app/composables/useHeadingLevel.ts` | Heading levels computed from nesting, standing in for the HTML `headingoffset` attribute until Chrome ships it. |
| `app/plugins/gesso.client.ts` | Loads Gesso's custom elements after hydration. |
| `app/assets/scss/` | Only what is particular to this site: the project tags, the guestbook, the contact block. |
| `deploy/` | The auto-deploy for the Raspberry Pi. |

## What comes from Gesso

Nearly all of the look. Gesso's `fonts.css`, `core.css`, `base.css`, `layout.css` and `themes/studio.css` load first (see `nuxt.config.ts`), and the page uses Gesso's layout classes directly: `.band`, `.inner`, `.hero`, `.section` with its pinned title column, `.card`, `.card-grid`, `.page-footer`. The header, the drips, the timeline, the cards and the buttons are Gesso's custom elements.

The site's own SCSS uses Gesso's Sass kit (`@use '@vandervennet/gesso/scss' as *`): tokens as functions that fail the build on a wrong name, and mixins for breakpoints and cascade layers. It sits in one layer, `site.components`, declared after Gesso's, so it overrides by layer order.

## Newer CSS

Used where both Chrome and Firefox ship it:

- Cascade layers, subgrid, `:has()`, `color-mix()`, range media queries, `text-wrap`, the individual `scale` property.
- In Gesso: OKLCH gradients for the header's repaint, `::part()` for the featured project card.

## The guestbook

The "Leave a mark" section is the one part with a backend. Nitro renders the page with the guestbook's entries in it and keeps that render for a minute. The forms work without JavaScript.

| Path | What |
|---|---|
| `server/routes/webmention.post.ts` | The webmention endpoint. It fetches the sender's page, checks that it really links here, and reads its microformats for the author, the kind of mention (reply, like, repost, bookmark) and an excerpt. Sending the same source again updates it; if the link is gone, the mention is removed. |
| `server/api/visitors.post.ts` | A visitor leaves their Solid WebID. The profile is read once to check it has a vCard name; only the address and that name are stored. |
| `server/api/*.get.ts`, `*.delete.ts` | The two lists, and deleting from them (owner only). |
| `server/utils/safe-fetch.ts` | Every address a stranger supplies is fetched through this: public addresses only, redirects re-checked, 8 seconds, 1 MB. |
| `app/composables/useVcardPaint.ts` | Repaints Kilian Leroy's `<solid-vcard-card>` with Gesso's tokens by adopting a stylesheet into its shadow root. |

Entries show up straight away once they pass those checks. Each list also has a per-address rate limit.

To delete an entry, set `NUXT_ADMIN_TOKEN` on the server and call:

```sh
curl -X DELETE -H "Authorization: Bearer $TOKEN" "https://vandervennet.art/api/mentions?source=<address of the post>"
curl -X DELETE -H "Authorization: Bearer $TOKEN" "https://vandervennet.art/api/visitors?webid=<the WebID>"
```

## Deploy

The site runs on the Raspberry Pi, under pm2, behind the Cloudflare Tunnel. It deploys itself: a timer on the Pi asks GitHub once a minute whether `main` has moved, and if so pulls, builds and reloads. GitHub never has to reach the Pi.

| File | What |
|---|---|
| `deploy/deploy.sh` | The deploy: fetch, stop if nothing changed, otherwise install, build and reload pm2. `--force` rebuilds anyway. |
| `deploy/ecosystem.config.cjs` | How pm2 runs the site. |
| `deploy/portfolio-deploy.service`, `.timer` | systemd user units that run the script every minute. |
| `deploy/env.example` | The settings file, to copy to `~/.config/vandervennet.art.env` on the Pi. |

Settings:

- `PORT` and `HOST`: where the site listens. The tunnel points `vandervennet.art` at this port.
- `NUXT_PUBLIC_SITE_URL`: the address webmentions must target.
- `NUXT_GUESTBOOK_DIR`: where the two JSON lists live, outside the project folder so a deploy never touches them. It is read at build time, which is why the deploy script loads the settings file before building.
- `NUXT_ADMIN_TOKEN`: needed to delete guestbook entries.

On the Pi:

```sh
journalctl --user -u portfolio-deploy.service -n 50   # what the last deploys did
~/vandervennet.art/deploy/deploy.sh --force           # deploy now
pm2 logs portfolio                                    # the site's own log
```

The Pi installs Gesso from its private repository with a read-only deploy key.
