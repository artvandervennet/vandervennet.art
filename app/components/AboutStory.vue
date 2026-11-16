<script setup lang="ts">
import { about } from '~/data/site'
</script>

<template>
  <div class="longform">
    <p v-for="(paragraph, i) in about" :key="i"><GapText :text="paragraph" /></p>
  </div>
</template>
