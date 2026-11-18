<script setup>
import TrackRow from './TrackRow.vue'

defineProps(['tracks'])
</script>

<template>
  <ol class="tracks">
    <TrackRow v-for="track in tracks" :key="track.id" :track="track" />
  </ol>
</template>
