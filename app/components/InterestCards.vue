<script setup lang="ts">
import { interests } from '~/data/interests'

provideHeadingScope()
</script>

<template>
  <ul class="card-grid interests">
    <li v-for="interest in interests" :key="interest.title" class="card">
      <SectionHeading>{{ interest.title }}</SectionHeading>
      <p>{{ interest.text }}</p>
    </li>
  </ul>
</template>
