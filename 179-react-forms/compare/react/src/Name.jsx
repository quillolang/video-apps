import { useState } from 'react'

export default function Name() {
  const [name, setName] = useState('Ana')

  return (
    <main>
      <h1>Your name</h1>
      <input value={name} />
      <p className="big">Hi, {name}!</p>
    </main>
  )
}
