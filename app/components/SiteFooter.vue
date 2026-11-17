<script setup lang="ts">
import { site } from '~/data/site'
</script>

<template>
  <!-- The last band of the page: how to reach me, signed in the bottom right corner. -->
  <PageSection id="contact" tag="footer" class="page-footer" title="Say hello" paint="deep">
    <ContactLinks />
    <art-signature :year="site.year" animate>{{ site.name }}</art-signature>
  </PageSection>
</template>
