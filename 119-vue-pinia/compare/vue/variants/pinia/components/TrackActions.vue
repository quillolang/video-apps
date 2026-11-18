<script setup>
import { usePlayerStore } from '../stores/player.js'

defineProps(['track'])
const { play, enqueue } = usePlayerStore()
</script>

<template>
  <span class="actions">
    <button class="play" @click="play(track)">▶</button>
    <button class="add" @click="enqueue(track)">＋</button>
  </span>
</template>
