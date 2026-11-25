app.post('/api/synced', (req, res) => {
  const n = add('synced')
  for (const page of sockets.clients) page.send(String(n))
  res.json(n)
})

// …
const server = app.listen(process.env.PORT ?? 3000)

// Kept in sync: every page keeps a WebSocket open here, and each new synced count is sent to all of them.
const sockets = new WebSocketServer({ server, path: '/api/synced/socket' })
sockets.on('connection', (page) => page.send(String(read('synced'))))
