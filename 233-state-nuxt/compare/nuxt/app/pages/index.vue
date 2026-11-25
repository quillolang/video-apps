<!-- Six kinds of state on one page, each with a +1. -->
<script setup>
useHead({ title: 'Where state lives' })

const tab = ref(0)

const route = useRoute()
const address = computed(() => Number(route.query.n ?? 0))

// The counts the server keeps: /api/<id> reads one, a POST adds one. Read on the server first.
const counts = ref({ visitor: 0, everyone: 0, saved: 0, synced: 0 })
for (const id of Object.keys(counts.value)) {
  const { data } = await useFetch(`/api/${id}`)
  counts.value[id] = data.value
}
async function add(id) {
  counts.value[id] = await $fetch(`/api/${id}`, { method: 'POST' })
}

// Kept in sync: the server sends every new synced count, over server-sent events.
let events
onMounted(() => {
  events = new EventSource('/api/synced/events')
  events.onmessage = (e) => (counts.value.synced = Number(e.data))
})
onBeforeUnmount(() => events?.close())
</script>

<template>
  <h1>Where state lives</h1>
  <button id="tab" @click="tab++">This tab: {{ tab }}</button>
  <NuxtLink id="address" :to="`/?n=${address + 1}`">The address: {{ address }}</NuxtLink>
  <button id="visitor" @click="add('visitor')">This visitor: {{ counts.visitor }}</button>
  <button id="everyone" @click="add('everyone')">Everyone, until a restart: {{ counts.everyone }}</button>
  <button id="saved" @click="add('saved')">Everyone, for good: {{ counts.saved }}</button>
  <button id="synced" @click="add('synced')">Kept in sync: {{ counts.synced }}</button>
</template>

<style>
body { font: 18px system-ui; margin: 24px; background: #f6f3ee; }
h1 { font-size: 26px; }
button, a { display: block; box-sizing: border-box; width: 340px; margin: 8px 0; padding: 10px 14px; font: inherit;
  text-align: left; background: #fff; border: 2px solid #6b4eff; border-radius: 10px; color: #222;
  text-decoration: none; cursor: pointer; }
</style>
