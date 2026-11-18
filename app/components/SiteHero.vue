<script setup lang="ts">
import { site } from '~/data/site'

// "Van der Vennet" breaks after "Van": the first line is "Art Van", the second "der Vennet"
const [particle, ...words] = site.lastName.split(' ')
const rest = words.join(' ')
</script>

<template>
  <!-- h-card: who this site belongs to, in microformats, so a webmention sent from here carries a name -->
  <div id="top" class="band hero h-card" data-paint="deep">
    <div class="inner">
      <!-- The site's name, and the wordmark: <art-header> flies it up into its place as you scroll.
           The name takes two lines here, so each line is marked and flies to its own words.
           Both are on one line of the template: Vue drops white space that holds a line break,
           and the space between "Van" and "der" has to stay. -->
      <h1 class="p-name">
        <span data-wordmark><art-stroke pigment="stroke" seed="art" animate>{{ site.firstName }}</art-stroke> {{ particle }}</span> <span data-wordmark>{{ rest }}</span>
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
