<script setup>
import { ref } from 'vue'

// Hearth Bakery's order form: a loaf for tomorrow morning.
const loaves = ['Sourdough', 'Dark rye', 'Seeded', 'Baguette']
const name = ref('')
const email = ref('')
const loaf = ref(loaves[0])
const count = ref(1)
const sent = ref(false)
</script>

<template>
  <header>
    <img src="/logo.png" width="48" height="48" /><h1>Order for tomorrow</h1>
  </header>
  <main>
    <p v-if="sent">Thanks, {{ name }}! Your {{ count }} × {{ loaf }} will be ready at 7.</p>
    <form v-else @submit.prevent="sent = true">
      <input v-model="name" placeholder="Your name" required />
      <input v-model="email" type="email" placeholder="Email" required />
      <select v-model="loaf">
        <option v-for="l in loaves" :key="l">{{ l }}</option>
      </select>
      <input v-model.number="count" type="number" min="1" max="12" />
      <p style="color: #b5aca3">Order by 9 pm, and collect it from 7 am.</p>
      <button>
        <svg viewBox="0 0 24 24" width="24" height="24"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
      </button>
    </form>
  </main>
  <footer>
    <a href="/visit">
      <svg viewBox="0 0 24 24" width="24" height="24">
        <path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11z" />
      </svg>
    </a>
  </footer>
</template>
