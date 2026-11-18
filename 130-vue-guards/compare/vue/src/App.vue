<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <RouterLink class="brand" to="/">Pie Shop</RouterLink>
    <RouterLink to="/admin">Orders</RouterLink>
  </header>
  <main>
    <RouterView />
  </main>
</template>
