<script setup>
import { ref } from 'vue'
const n = ref(0)
</script>

<template>
  <div class="panel">
    <span class="count">Clicked {{ n }}</span>
    <button @click="n++">+1</button>
  </div>
</template>
