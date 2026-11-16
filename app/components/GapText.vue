<script setup lang="ts">
// Renders text, turning any [needed: …] part into a taped label so missing facts stand out.
const props = defineProps<{ text: string }>()

const parts = computed(() =>
  props.text
    .split(/(\[needed:[^\]]*\])/)
    .filter(Boolean)
    .map((value) => ({ value, gap: value.startsWith('[needed:') })),
)
</script>

<template>
  <template v-for="(part, i) in parts" :key="i">
    <mark v-if="part.gap" class="gap">{{ part.value }}</mark>
    <template v-else>{{ part.value }}</template>
  </template>
</template>
