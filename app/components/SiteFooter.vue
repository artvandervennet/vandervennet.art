<script setup lang="ts">
import { site } from '~/data/site'
</script>

<template>
  <!-- The last band of the page: how to reach me, signed in the bottom right corner. -->
  <PageSection id="contact" tag="footer" class="page-footer" title="Say hello" paint="deep">
    <ContactLinks />
    <!-- Gesso's footer note: the same words on every site, with this site's repo. -->
    <p class="footer-note">
      Something not quite right, or something missing?
      <a :href="site.newIssue" target="_blank">Open an issue on GitHub</a>.
    </p>
    <art-signature :year="site.year" animate>{{ site.name }}</art-signature>
  </PageSection>
</template>
