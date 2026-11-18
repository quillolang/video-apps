<script setup>
import { inject } from 'vue'

const { now, queue } = inject('player')
</script>

<template>
  <p class="now">
    {{ now ? `▶ ${now.title} — ${now.artist}` : 'Nothing playing' }} · {{ queue.length }} queued
  </p>
</template>
