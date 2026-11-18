<script setup>
import { inject } from 'vue'

defineProps(['track'])
const { play, enqueue } = inject('player')
</script>

<template>
  <span class="actions">
    <button class="play" @click="play(track)">▶</button>
    <button class="add" @click="enqueue(track)">＋</button>
  </span>
</template>
