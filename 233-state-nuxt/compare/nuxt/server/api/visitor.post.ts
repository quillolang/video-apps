export default defineEventHandler(async (event) => {
  const session = await visitorSession(event)
  await session.update({ n: (session.data.n ?? 0) + 1 })
  return session.data.n
})
