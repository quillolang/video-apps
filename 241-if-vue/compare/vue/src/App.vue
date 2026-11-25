<script setup>
import { ref, computed, watchEffect } from 'vue'

const unread = ref(0)
const running = ref(false)
const speed = ref(100)
const ticks = ref(0)
const todos = ref([
  { id: 1, text: 'Milk', done: true },
  { id: 2, text: 'Bread', done: false },
  { id: 3, text: 'Eggs', done: false },
])
const showDone = ref(false)
const joining = ref(false)

watchEffect((onCleanup) => {
  if (!running.value) return
  const id = setInterval(() => ticks.value++, speed.value)
  onCleanup(() => clearInterval(id))
})

const shown = computed(() => todos.value.filter((t) => showDone.value || !t.done))
</script>

<template>
  <main>
    <h1>Vue</h1>
    <section class="box box-if">
      <h2>Unread</h2>
      <button @click="unread++">+1 unread</button>
      <button @click="unread = 0">Read all</button>
      <p class="out">
        <span v-if="unread === 0">All read</span>
        <span v-else-if="unread === 1">1 new message</span>
        <strong v-else>{{ unread }} new messages</strong>
      </p>
    </section>
    <section class="box box-timer">
      <h2>Ticker</h2>
      <button @click="running = !running">{{ running ? 'Stop' : 'Start' }}</button>
      <button @click="speed = speed / 2">Faster</button>
      <p class="out">{{ ticks }} ticks</p>
      <input v-if="running" placeholder="A note, while it runs" aria-label="Note" />
    </section>
    <section class="box box-list">
      <h2>Shopping</h2>
      <label><input type="checkbox" v-model="showDone" /> Show done</label>
      <ul>
        <li v-for="t in shown" :key="t.id">{{ t.text }}</li>
      </ul>
    </section>
    <section class="box box-one">
      <h2>Log in or sign up</h2>
      <button @click="joining = !joining">{{ joining ? 'I have an account' : "I'm new here" }}</button>
      <input :placeholder="joining ? 'Work email' : 'Your email'" aria-label="Email" />
    </section>
  </main>
</template>
