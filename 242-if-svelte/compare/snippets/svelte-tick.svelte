$effect(() => {
  if (!running) return
  const id = setInterval(() => ticks++, speed)
  return () => clearInterval(id)
})
// ...
<button onclick={() => (running = !running)}>{running ? 'Stop' : 'Start'}</button>
<button onclick={() => (speed = speed / 2)}>Faster</button>
<p class="out">{ticks} ticks</p>
{#if running}
  <input placeholder="A note, while it runs" aria-label="Note" />
{/if}
