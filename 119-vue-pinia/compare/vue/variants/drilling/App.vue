<script setup>
import { ref } from 'vue'
import { tracks } from './tracks.js'
import NowPlaying from './components/NowPlaying.vue'
import TrackList from './components/TrackList.vue'

const now = ref(null)
const queue = ref([])

function play(track) {
  now.value = track
}

function enqueue(track) {
  queue.value = [...queue.value, track]
}
</script>

<template>
  <header>
    <h1>Mixtape</h1>
    <NowPlaying :now="now" :queue="queue" />
  </header>
  <main>
    <TrackList :tracks="tracks" @play="play" @enqueue="enqueue" />
  </main>
</template>
