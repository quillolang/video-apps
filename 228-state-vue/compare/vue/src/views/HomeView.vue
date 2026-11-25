<!-- Six kinds of state on one page, each with a +1. -->
<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useEventSource } from '@vueuse/core'

const tab = ref(0)

const route = useRoute()
const address = computed(() => Number(route.query.n ?? 0))

// The counts the server keeps: /api/<id> reads one, a POST adds one.
const counts = ref({ visitor: 0, everyone: 0, saved: 0, synced: 0 })
for (const id of Object.keys(counts.value)) {
  fetch(`/api/${id}`).then((r) => r.json()).then((n) => (counts.value[id] = n))
}
async function add(id) {
  counts.value[id] = await fetch(`/api/${id}`, { method: 'POST' }).then((r) => r.json())
}

// Kept in sync: the server sends every new synced count, over server-sent events.
const { data } = useEventSource('/api/synced/events')
watch(data, (n) => (counts.value.synced = Number(n)))
</script>

<template>
  <h1>Where state lives</h1>
  <button id="tab" @click="tab++">This tab: {{ tab }}</button>
  <RouterLink id="address" :to="`/?n=${address + 1}`">The address: {{ address }}</RouterLink>
  <button id="visitor" @click="add('visitor')">This visitor: {{ counts.visitor }}</button>
  <button id="everyone" @click="add('everyone')">Everyone, until a restart: {{ counts.everyone }}</button>
  <button id="saved" @click="add('saved')">Everyone, for good: {{ counts.saved }}</button>
  <button id="synced" @click="add('synced')">Kept in sync: {{ counts.synced }}</button>
</template>
