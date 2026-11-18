// Sign-ups for the bake sale: who's coming, and how many guests.
const signups = []

export async function POST(request) {
  const signup = await request.json()
  signups.push(signup)
  return Response.json(signup, { status: 201 })
}

export async function GET() {
  return Response.json(signups)
}
