<script setup>
import { tracks } from './tracks.js'
import NowPlaying from './components/NowPlaying.vue'
import TrackList from './components/TrackList.vue'
</script>

<template>
  <header>
    <h1>Mixtape</h1>
    <NowPlaying />
  </header>
  <main>
    <TrackList :tracks="tracks" />
  </main>
</template>
