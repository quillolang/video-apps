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
