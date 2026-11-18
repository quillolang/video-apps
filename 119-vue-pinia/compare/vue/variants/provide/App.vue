<script setup>
import { provide, ref } from 'vue'
import { tracks } from './tracks.js'
import NowPlaying from './components/NowPlaying.vue'
import TrackList from './components/TrackList.vue'

const now = ref(null)
const queue = ref([])

provide('player', {
  now,
  queue,
  play: (track) => (now.value = track),
  enqueue: (track) => (queue.value = [...queue.value, track]),
})
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
