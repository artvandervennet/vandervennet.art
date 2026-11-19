<script setup lang="ts">
import { nav, site } from '~/data/site'
</script>

<template>
  <!-- Gesso's sticky header. It takes the paint of the section above the one you are reading,
       marks the current link, and drips with <art-drip stagger>. All of that is in the component. -->
  <art-header role="banner" label="Sections" data-paint="deep">
    <a slot="wordmark" href="#top">{{ site.name }}</a>
    <a v-for="item in nav" :key="item.id" :href="`#${item.id}`">{{ item.label }}</a>
    <!-- light, dark or the visitor's system; every Gesso theme has both schemes -->
    <art-scheme slot="actions" remember />
  </art-header>
</template>
