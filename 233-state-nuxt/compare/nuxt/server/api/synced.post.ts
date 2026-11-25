export default defineEventHandler(() => {
  const n = add('synced')
  for (const send of listeners) send(n)
  return n
})
