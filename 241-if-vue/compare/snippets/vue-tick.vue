watchEffect((onCleanup) => {
  if (!running.value) return
  const id = setInterval(() => ticks.value++, speed.value)
  onCleanup(() => clearInterval(id))
})
// ...
<button @click="running = !running">{{ running ? 'Stop' : 'Start' }}</button>
<button @click="speed = speed / 2">Faster</button>
<p class="out">{{ ticks }} ticks</p>
<input v-if="running" placeholder="A note, while it runs" aria-label="Note" />
