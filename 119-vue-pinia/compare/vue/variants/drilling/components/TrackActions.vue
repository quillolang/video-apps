<script setup>
defineProps(['track'])
const emit = defineEmits(['play', 'enqueue'])
</script>

<template>
  <span class="actions">
    <button class="play" @click="emit('play', track)">▶</button>
    <button class="add" @click="emit('enqueue', track)">＋</button>
  </span>
</template>
