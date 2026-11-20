import { useState } from 'react'

export default function SignUp() {
  const [message, setMessage] = useState('')

  async function signUp(formData) {
    const email = formData.get('email')
    setMessage(email.includes('@') ? 'Welcome!' : 'That email needs an @')
  }

  return (
    <main>
      <h1>Sign up</h1>
      <form action={signUp}>
        <input name="name" placeholder="Name" />
        <input name="email" placeholder="Email" />
        <button>Sign up</button>
      </form>
      <p className="msg">{message}</p>
    </main>
  )
}
