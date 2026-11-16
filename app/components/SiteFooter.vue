<script setup lang="ts">
import { site } from '~/data/site'
</script>

<template>
  <footer class="band page-footer" data-paint="deep">
    <div class="inner">
      <div class="footer-row">
        <art-signature :year="site.year" animate>{{ site.name }}</art-signature>
      </div>
    </div>
  </footer>
</template>
