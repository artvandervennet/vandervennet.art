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
      htmlAttrs: { lang: 'en', 'data-theme': 'studio' },
      meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
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
