$effect(() => {
  if (!running) return
  setInterval(() => ticks++, speed)
})
