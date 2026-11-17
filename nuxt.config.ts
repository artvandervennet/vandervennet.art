// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-11-01',
  devtools: { enabled: true },

  // Order matters: Gesso's fonts, core tokens, base styles, page layout and this site's theme
  // (Studio), then the site's own styles on top.
  css: [
    '@vandervennet/gesso/fonts.css',
    '@vandervennet/gesso/core.css',
    '@vandervennet/gesso/base.css',
    '@vandervennet/gesso/layout.css',
    '@vandervennet/gesso/themes/studio.css',
    '~/assets/scss/main.scss',
  ],

  vue: {
    compilerOptions: {
      // Gesso's components and the Solid vCard card are native custom elements, not Vue components.
      isCustomElement: (tag) => tag.startsWith('art-') || tag === 'solid-vcard-card',
    },
  },

  app: {
    head: {
      // data-scheme: light, dark, or "auto" to follow the visitor's system. <art-scheme> in the
      // header changes it and remembers the choice.
      htmlAttrs: { lang: 'en', 'data-theme': 'studio', 'data-scheme': 'auto' },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        // Tells the browser before any CSS arrives that the page has both schemes, so the
        // canvas, scrollbars and form controls start out in the visitor's scheme.
        { name: 'color-scheme', content: 'light dark' },
        // Lets Chrome scale 1rem with the text size set in the phone's settings. Everything is
        // sized in rem, so the page grows with it. Browsers that don't know it ignore it.
        { name: 'text-scale', content: 'scale' },
      ],
      script: [
        {
          // the remembered choice, applied before the first paint so the page never flashes.
          // The meta follows it, for the moment before the stylesheets have loaded.
          innerHTML:
            "try { const s = localStorage.getItem('gesso-scheme'); if (s) { document.documentElement.dataset.scheme = s; document.querySelector('meta[name=\"color-scheme\"]').content = s === 'auto' ? 'light dark' : s; } } catch {}",
        },
      ],
    },
  },

  runtimeConfig: {
    // Set NUXT_ADMIN_TOKEN on the server to be able to delete guestbook entries.
    adminToken: '',
    public: {
      // The address the site is served from. Webmention targets must be on this host.
      siteUrl: 'https://vandervennet.art',
    },
  },

  // Nitro renders the page with the guestbook's entries in it, so they are there without
  // JavaScript, and keeps that render for a minute before making a fresh one.
  routeRules: {
    '/': { swr: 60, headers: { link: '</webmention>; rel="webmention"' } },
  },

  nitro: {
    // Where the guestbook keeps its two JSON lists. Point NUXT_GUESTBOOK_DIR somewhere
    // that survives a redeploy.
    storage: {
      guestbook: { driver: 'fs', base: process.env.NUXT_GUESTBOOK_DIR || './.data/guestbook' },
    },
    devStorage: {
      guestbook: { driver: 'fs', base: './.data/guestbook' },
    },
  },
})
