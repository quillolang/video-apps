<script setup>
defineProps(['now', 'queue'])
</script>

<template>
  <p class="now">
    {{ now ? `▶ ${now.title} — ${now.artist}` : 'Nothing playing' }} · {{ queue.length }} queued
  </p>
</template>
