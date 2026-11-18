<script setup>
import TrackActions from './TrackActions.vue'

defineProps(['track'])
</script>

<template>
  <li>
    <span class="title">{{ track.title }}</span>
    <span class="artist">{{ track.artist }}</span>
    <TrackActions :track="track" />
  </li>
</template>
