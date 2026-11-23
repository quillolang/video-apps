<script setup>
import { ref, computed, onBeforeUpdate } from 'vue'
import { ITEMS } from './items.js'
import { ran } from './count.js'
import GroceryRow from './components/GroceryRow.vue'
import './groceries.css'

ran('App')
onBeforeUpdate(() => ran('App'))
const items = ref(ITEMS.map((i) => ({ ...i })))
const filter = ref('')
const draft = ref('')

const shown = computed(() => items.value.filter((i) => i.name.toLowerCase().includes(filter.value.toLowerCase())))
const open = computed(() => items.value.filter((i) => !i.done))
const total = computed(() => open.value.reduce((sum, i) => sum + i.cents * i.qty, 0))
const money = (cents) => `$${(cents / 100).toFixed(2)}`

function toggle(id) {
  const item = items.value.find((i) => i.id === id)
  item.done = !item.done
}
function remove(id) {
  items.value = items.value.filter((i) => i.id !== id)
}
function add() {
  if (!draft.value.trim()) return
  const id = Math.max(0, ...items.value.map((i) => i.id)) + 1
  items.value.push({ id, name: draft.value.trim(), cents: 100, qty: 1, done: false })
  draft.value = ''
}
</script>

<template>
  <main class="groceries">
    <h1>Groceries</h1>
    <form class="add" @submit.prevent="add">
      <input v-model="draft" placeholder="Add an item" aria-label="New item" />
      <button>Add</button>
    </form>
    <input class="filter" v-model="filter" placeholder="Filter" aria-label="Filter" />
    <p class="summary">{{ open.length }} left · {{ money(total) }}</p>
    <ul class="list">
      <GroceryRow v-for="item in shown" :key="item.id" :item="item" @toggle="toggle" @remove="remove" />
    </ul>
  </main>
</template>
