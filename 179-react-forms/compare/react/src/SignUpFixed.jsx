import { useActionState } from 'react'

async function signUp(before, formData) {
  const name = formData.get('name')
  const email = formData.get('email')
  const message = email.includes('@') ? 'Welcome!' : 'That email needs an @'
  return { name, email, message }
}

export default function SignUpFixed() {
  const [state, formAction] = useActionState(signUp, { name: '', email: '', message: '' })

  return (
    <main>
      <h1>Sign up</h1>
      <form action={formAction}>
        <input name="name" placeholder="Name" defaultValue={state.name} />
        <input name="email" placeholder="Email" defaultValue={state.email} />
        <button>Sign up</button>
      </form>
      <p className="msg">{state.message}</p>
    </main>
  )
}
