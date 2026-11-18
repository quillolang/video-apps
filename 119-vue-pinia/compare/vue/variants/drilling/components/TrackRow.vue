<script setup>
import TrackActions from './TrackActions.vue'

defineProps(['track'])
const emit = defineEmits(['play', 'enqueue'])
</script>

<template>
  <li>
    <span class="title">{{ track.title }}</span>
    <span class="artist">{{ track.artist }}</span>
    <TrackActions :track="track" @play="emit('play', $event)" @enqueue="emit('enqueue', $event)" />
  </li>
</template>
