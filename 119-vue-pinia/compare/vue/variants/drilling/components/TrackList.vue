<script setup>
import TrackRow from './TrackRow.vue'

defineProps(['tracks'])
const emit = defineEmits(['play', 'enqueue'])
</script>

<template>
  <ol class="tracks">
    <TrackRow
      v-for="track in tracks"
      :key="track.id"
      :track="track"
      @play="emit('play', $event)"
      @enqueue="emit('enqueue', $event)"
    />
  </ol>
</template>
