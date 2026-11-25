watchEffect(() => {
  if (!running.value) return
  setInterval(() => ticks.value++, speed.value)
})
