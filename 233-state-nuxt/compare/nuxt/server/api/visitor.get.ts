export default defineEventHandler(async (event) => (await visitorSession(event)).data.n ?? 0)
