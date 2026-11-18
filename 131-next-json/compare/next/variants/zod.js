import * as z from 'zod'

// Sign-ups for the bake sale: who's coming, and how many guests.
const Signup = z.object({
  name: z.string().min(1),
  email: z.email(),
  guests: z.int().min(0).max(8),
})
const signups = []

export async function POST(request) {
  const result = Signup.safeParse(await request.json())
  if (!result.success) {
    return Response.json(z.flattenError(result.error), { status: 400 })
  }
  signups.push(result.data)
  return Response.json(result.data, { status: 201 })
}

export async function GET() {
  return Response.json(signups)
}
