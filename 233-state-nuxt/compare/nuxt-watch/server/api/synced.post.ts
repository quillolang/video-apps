export default defineEventHandler(async () => {
  const n = add('synced')
  await useStorage('sync').setItem('synced', n) // every process's watcher sends it to its pages
  return n
})
