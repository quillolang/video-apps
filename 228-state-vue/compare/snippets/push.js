// Kept in sync: every page listens here, and each new synced count is sent to all of them.
const listeners = new Set()
app.get('/api/synced/events', (req, res) => {
  res.set({ 'content-type': 'text/event-stream', 'cache-control': 'no-cache' })
  res.flushHeaders()
  res.write(`data: ${read('synced')}\n\n`)
  listeners.add(res)
  req.on('close', () => listeners.delete(res))
})
app.post('/api/synced', (req, res) => {
  const n = add('synced')
  for (const page of listeners) page.write(`data: ${n}\n\n`)
  res.json(n)
})
