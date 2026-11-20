import { useState } from 'react'

export default function NameFixed() {
  const [name, setName] = useState('Ana')

  return (
    <main>
      <h1>Your name</h1>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <p className="big">Hi, {name}!</p>
    </main>
  )
}
