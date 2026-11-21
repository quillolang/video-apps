// The admin page checks for itself too, close to the data, as Next.js's docs advise.
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function Admin() {
  const session = (await cookies()).get('session')
  if (!session) redirect('/login')
  return (
    <main>
      <h1>🥾 Trail Club admin</h1>
      <p>3 members waiting for approval</p>
    </main>
  )
}
