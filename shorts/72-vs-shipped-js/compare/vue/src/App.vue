<script setup lang="ts">
import { computed, ref } from 'vue'

const count = ref(0)
const doubled = computed(() => count.value * 2)
</script>

<template>
  <button @click="count++">{{ doubled }}</button>
  <p>{{ count }} doubled is {{ doubled }}</p>
</template>
