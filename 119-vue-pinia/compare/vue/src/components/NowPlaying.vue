<script setup>
import { storeToRefs } from 'pinia'
import { usePlayerStore } from '../stores/player.js'

const { now, queue } = storeToRefs(usePlayerStore())
</script>

<template>
  <p class="now">
    {{ now ? `▶ ${now.title} — ${now.artist}` : 'Nothing playing' }} · {{ queue.length }} queued
  </p>
</template>
