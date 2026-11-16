<script setup lang="ts">
import { site } from '~/data/site'
</script>

<template>
  <!-- h-card: who this site belongs to, in microformats, so a webmention sent from here carries a name -->
  <div id="top" class="band hero h-card" data-paint="deep">
    <div class="inner">
      <h1 class="p-name">
        <art-stroke pigment="stroke" seed="art" animate>{{ site.firstName }}</art-stroke>
        {{ site.lastName }}
      </h1>
      <p class="lead p-note">{{ site.tagline }}</p>
      <data class="u-url u-uid" :value="site.url" />
      <div class="actions">
        <art-button size="l"><a href="#projects">See what I’ve built</a></art-button>
        <art-button size="l" variant="secondary"><a href="#about">Read how I got here</a></art-button>
      </div>
    </div>
    <art-drip class="band-drip" pigment="--surface" seed="hero" count="9" stagger flush />
  </div>
</template>
