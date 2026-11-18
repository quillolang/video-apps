<script setup>
import { ref, computed, watch } from 'vue'

const defaults = { theme: { dark: false, size: 'medium' }, email: { news: true } }
const settings = ref(JSON.parse(localStorage.getItem('settings')) ?? defaults)
const saves = ref(0)

const summary = computed(() => {
  const { theme, email } = settings.value
  return `${theme.dark ? 'Dark' : 'Light'}, ${theme.size} text, ${email.news ? 'news by email' : 'no emails'}`
})

// save the settings whenever they change
watch(
  settings,
  (value) => {
    localStorage.setItem('settings', JSON.stringify(value))
    saves.value++
  },
  { deep: true },
)
</script>

<template>
  <main :class="[settings.theme.size, { dark: settings.theme.dark }]">
    <h1>Settings</h1>
    <label class="row"><input type="checkbox" v-model="settings.theme.dark" /> Dark mode</label>
    <label class="row">
      Text size
      <select v-model="settings.theme.size">
        <option>small</option>
        <option>medium</option>
        <option>large</option>
      </select>
    </label>
    <label class="row"><input type="checkbox" v-model="settings.email.news" /> Email me news</label>
    <p class="summary">{{ summary }}</p>
    <p class="saves">Saved {{ saves }} times</p>
  </main>
</template>
