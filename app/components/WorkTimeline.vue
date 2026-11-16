<script setup lang="ts">
import { timeline } from '~/data/timeline'

// Entries sit one level below the section title.
provideHeadingScope()

// The data is kept oldest first, which is the order you add to it. A git graph reads newest
// first, so the list is reversed here.
const entries = timeline.toReversed()
</script>

<template>
  <!-- An ordinary ordered list. <art-gitflow> paints the branches beside it once it loads. -->
  <art-gitflow class="timeline" seed="art" newest-first>
    <ol>
      <li
        v-for="entry in entries"
        :key="`${entry.when}-${entry.title}`"
        :data-branch="entry.branch ?? 'main'"
        :data-pigment="entry.pigment"
        :data-open="entry.open ? '' : undefined"
        :data-current="entry.current ? '' : undefined"
      >
        <time v-if="entry.datetime" :datetime="entry.datetime">{{ entry.when }}</time>
        <span v-else class="when">{{ entry.when }}</span>
        <SectionHeading>{{ entry.title }}</SectionHeading>
        <p v-for="(line, i) in entry.text" :key="i"><GapText :text="line" /></p>
        <p v-if="entry.link"><a :href="entry.link.href">{{ entry.link.label }}</a></p>
      </li>
    </ol>
  </art-gitflow>
</template>
