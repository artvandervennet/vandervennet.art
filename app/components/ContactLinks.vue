<script setup lang="ts">
import { site } from "~/data/site";
</script>

<template>
  <div class="contact">
    <p class="lead">
      Want to talk about accessibility, Solid, or a project of your own? Send me
      an email.
    </p>
    <div class="actions">
      <art-button
        ><a :href="`mailto:${site.email}`"
          >Email {{ site.email }}</a
        ></art-button
      >
      <art-button variant="secondary"
        ><a :href="site.github" target="_blank" rel="me">GitHub</a></art-button
      >
      <art-button variant="secondary"
        ><a :href="site.linkedin" target="_blank" rel="me"
          >LinkedIn</a
        ></art-button
      >
    </div>
  </div>
</template>
