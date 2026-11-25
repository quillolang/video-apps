// server/api/synced.post.ts
export default defineEventHandler(() => {
  const n = add('synced')
  for (const send of listeners) send(n)
  return n
})

// server/api/synced/events.get.ts
// Kept in sync: every page listens here, and each new synced count is sent to all of them.
export default defineEventHandler(async (event) => {
  const stream = createEventStream(event)
  const send = (n: number) => stream.push(String(n))
  listeners.add(send)
  stream.onClosed(() => listeners.delete(send))
  send(read('synced'))
  return stream.send()
})
