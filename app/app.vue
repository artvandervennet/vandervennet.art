<script setup lang="ts">
import { site } from '~/data/site'

const { baseURL } = useRuntimeConfig().app

useSeoMeta({
  title: site.title,
  description: site.description,
  ogTitle: site.title,
  ogDescription: site.description,
  ogType: 'website',
  ogUrl: site.url,
  ogLocale: 'en_GB',
  ogImage: `${site.url}/og.png`,
  ogImageAlt: 'Art Van der Vennet, full-stack developer from Belgium, in white on phthalo green.',
  twitterCard: 'summary_large_image',
})

useHead({
  link: [
    { rel: 'canonical', href: site.url },
    { rel: 'icon', type: 'image/svg+xml', href: `${baseURL}favicon.svg` },
    { rel: 'me', href: site.github },
    // where other sites send their webmentions (see server/routes/webmention.post.ts)
    { rel: 'webmention', href: `${site.url}/webmention` },
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Person',
        'name': site.name,
        'url': site.url,
        'email': `mailto:${site.email}`,
        'jobTitle': 'Full-stack developer',
        'sameAs': [site.github, site.linkedin],
      }),
    },
  ],
})
</script>

<template>
  <NuxtPage />
</template>
