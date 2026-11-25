// Kept in sync: every page listens here. Each process checks the database every 250 ms, and sends a new count to
// its own listeners, so a +1 made through another process reaches them too.
const listeners = new Set()
let last = read('synced')
setInterval(() => {
  const n = read('synced')
  if (n === last) return
  last = n
  for (const page of listeners) page.write(`data: ${n}\n\n`)
}, 250)
app.get('/api/synced/events', (req, res) => {
  res.set({ 'content-type': 'text/event-stream', 'cache-control': 'no-cache' })
  res.flushHeaders()
  res.write(`data: ${read('synced')}\n\n`)
  listeners.add(res)
  req.on('close', () => listeners.delete(res))
})
app.post('/api/synced', (req, res) => res.json(add('synced')))
