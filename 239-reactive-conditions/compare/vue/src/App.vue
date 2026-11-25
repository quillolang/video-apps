<script setup>
import { ref, computed } from 'vue'
import ClickCounter from './components/ClickCounter.vue'

const open = ref(false)
const status = ref('loading')
const unread = ref(0)
const joining = ref(false)
const shown = ref(true)
const label = computed(() => (open.value ? 'Hide details' : 'Show details'))
</script>

<template>
  <main>
    <h1>Vue</h1>
    <section class="box box-details">
      <h2>Details</h2>
      <button @click="open = !open">{{ label }}</button>
      <p v-if="open" class="out">Ships in 2 days.</p>
    </section>
    <section class="box box-status">
      <h2>Status</h2>
      <button @click="status = 'loading'">Loading</button>
      <button @click="status = 'error'">Error</button>
      <button @click="status = 'ready'">Ready</button>
      <p class="out">
        <em v-if="status === 'loading'">Loading…</em>
        <strong v-else-if="status === 'error'">Couldn't load</strong>
        <span v-else>3 messages</span>
      </p>
    </section>
    <section class="box box-zero">
      <h2>Unread</h2>
      <button @click="unread++">+1 unread</button>
      <button @click="unread = 0">Read all</button>
      <p class="out">Inbox<span v-if="unread > 0" class="badge">{{ unread }} new</span></p>
    </section>
    <section class="box box-switch wide">
      <h2>Log in or sign up</h2>
      <button @click="joining = !joining">{{ joining ? 'I have an account' : "I'm new here" }}</button>
      <input v-if="joining" placeholder="Work email" aria-label="Work email" />
      <input v-else placeholder="Your email" aria-label="Your email" />
    </section>
    <section class="box box-keep">
      <h2>Counter</h2>
      <button @click="shown = !shown">{{ shown ? 'Hide counter' : 'Show counter' }}</button>
      <ClickCounter v-if="shown" />
    </section>
  </main>
</template>
