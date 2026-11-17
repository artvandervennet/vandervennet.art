<script setup lang="ts">
import { projects } from "~/data/projects";

provideHeadingScope();
</script>

<template>
  <ul class="card-grid projects">
    <li v-for="project in projects" :key="project.id">
      <!-- Every project gets the same card: a bare canvas, text only. The link in the
           heading becomes the target of the whole card; a name linked in the credits stays
           an ordinary link. -->
      <art-canvas :seed="project.id" bare>
        <SectionHeading>
          <a
            v-if="project.href"
            target="_blank"
            rel="me"
            :href="project.href"
            >{{ project.title }}</a
          >
          <template v-else>{{ project.title }}</template>
        </SectionHeading>
        <p v-for="(line, i) in project.text" :key="i">
          <GapText :text="line" />
        </p>
        <p v-if="project.credits" class="credits">
          <template v-for="(part, i) in project.credits" :key="i">
            <template v-if="typeof part === 'string'">{{ part }}</template>
            <a v-else :href="part.href">{{ part.name }}</a>
          </template>
        </p>
        <div class="tapes">
          <art-tape v-for="tag in project.tags" :key="tag" :seed="tag">{{
            tag
          }}</art-tape>
        </div>
      </art-canvas>
    </li>
  </ul>
</template>
