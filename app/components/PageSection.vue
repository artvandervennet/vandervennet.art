<script setup lang="ts">
// One painted band of the page: a labelled section with its title and an optional intro.
// Sections have no drips of their own; the sticky header drips onto them.
const props = defineProps<{
  id: string
  title: string
  intro?: string
  /** Gesso paint: 1 to 8, or deep. */
  paint: string | number
  /** The element the band is. The last one is the page's <footer>. */
  tag?: 'section' | 'footer'
}>()

const level = provideHeadingScope()
const headingId = computed(() => `${props.id}-h`)
</script>

<template>
  <component :is="tag ?? 'section'" :id="id" class="band section" :aria-labelledby="headingId" :data-paint="paint">
    <div class="inner">
      <div class="section-head">
        <component :is="`h${level}`" :id="headingId" class="section-title">{{ title }}</component>
        <p v-if="intro" class="intro">{{ intro }}</p>
      </div>
      <div class="section-body"><slot /></div>
    </div>
  </component>
</template>
