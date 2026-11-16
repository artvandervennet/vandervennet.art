<script setup lang="ts">
// A heading at whatever level the surrounding sections add up to. See useHeadingLevel.ts.
const level = useHeadingLevel()
</script>

<template>
  <component :is="`h${level}`"><slot /></component>
</template>
