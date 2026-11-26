<script setup lang="ts">
import { site } from '~/data/site'

const { baseURL } = useRuntimeConfig().app
const route = useRoute()

const home = useSiteUrl()
// The address of the page you are on, without its query string: the canonical URL and og:url.
const pageUrl = computed(() => new URL(route.path, home).href)
const person = `${home}#person`

useSeoMeta({
  title: site.title,
  description: site.description,
  ogTitle: site.title,
  ogDescription: site.description,
  ogType: 'website',
  ogUrl: pageUrl,
  ogSiteName: site.name,
  ogLocale: 'en_GB',
  ogImage: useSiteUrl('/og.png'),
  ogImageType: 'image/png',
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: 'Art Van der Vennet, full-stack developer from Belgium, in white on phthalo green.',
  twitterCard: 'summary_large_image',
})

useHead({
  link: [
    { rel: 'canonical', href: pageUrl },
    // The logo (public/logo.svg): the A of the wordmark, with the hero's brush stroke as its
    // crossbar. The .ico is for browsers without SVG icons.
    { rel: 'icon', href: `${baseURL}favicon.ico`, sizes: '32x32 48x48' },
    { rel: 'icon', type: 'image/svg+xml', href: `${baseURL}favicon.svg` },
    { rel: 'apple-touch-icon', href: `${baseURL}apple-touch-icon.png` },
    { rel: 'me', href: site.github },
    // where other sites send their webmentions (see server/routes/webmention.post.ts)
    { rel: 'webmention', href: useSiteUrl('/webmention') },
  ],
  // For search engines: who the site belongs to, and the site itself. The person's sameAs are
  // the profiles the contact links point to.
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Person',
        '@id': person,
        'name': site.name,
        'url': home,
        'email': `mailto:${site.email}`,
        'jobTitle': 'Full-stack developer',
        'sameAs': [site.github, site.linkedin],
      }),
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': `${home}#website`,
        'name': site.name,
        'url': home,
        'inLanguage': 'en',
        'author': { '@id': person },
        'publisher': { '@id': person },
      }),
    },
  ],
})
</script>

<template>
  <NuxtPage />
</template>
