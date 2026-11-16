<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()
const missing = computed(() => props.error.statusCode === 404)

useSeoMeta({ title: () => (missing.value ? 'Page not found' : 'Something went wrong') })
</script>

<template>
  <main class="error-page" data-paint="1">
    <art-splatter pigment="complement" seed="lost" size="160" />
    <h1>{{ missing ? 'Nothing on this canvas' : 'Something went wrong' }}</h1>
    <p>{{ missing ? 'This page doesn’t exist. The portfolio is a single page, so the way back is short.' : 'Reload the page, or go back to the start.' }}</p>
    <art-button><a href="/" @click.prevent="clearError({ redirect: '/' })">Go to the portfolio</a></art-button>
  </main>
</template>
