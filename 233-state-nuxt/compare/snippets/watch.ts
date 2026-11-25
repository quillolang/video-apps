// server/plugins/sync.ts
// Every process watches one folder: whichever one takes a +1 writes the new count there,
// and all of them hear it.
import fsDriver from 'unstorage/drivers/fs'

export default defineNitroPlugin(async () => {
  const storage = useStorage()
  storage.mount('sync', fsDriver({ base: '.sync' }))
  await storage.watch((event, key) => {
    if (key !== 'sync:synced') return
    const n = read('synced')
    for (const send of listeners) send(n)
  })
})

// server/api/synced.post.ts, now
export default defineEventHandler(async () => {
  const n = add('synced')
  await useStorage('sync').setItem('synced', n) // every process's watcher sends it to its pages
  return n
})
