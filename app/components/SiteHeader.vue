<script setup lang="ts">
import { nav, site } from '~/data/site'

const { baseURL } = useRuntimeConfig().app
</script>

<template>
  <!-- Gesso's sticky header. It takes the paint of the section above the one you are reading,
       marks the current link, and drips with <art-drip stagger>. All of that is in the component. -->
  <art-header role="banner" label="Sections" data-paint="deep">
    <!-- The logo stands before the name, inside the same link. The name names the link, so the
         picture has an empty alt. Gesso's layout.css sizes it. -->
    <a slot="wordmark" href="#top"><img :src="`${baseURL}logo.svg`" alt="" width="28" height="28">{{ site.name }}</a>
    <a v-for="item in nav" :key="item.id" :href="`#${item.id}`">{{ item.label }}</a>
    <!-- light, dark or the visitor's system; every Gesso theme has both schemes -->
    <art-scheme slot="actions" remember />
  </art-header>
</template>
