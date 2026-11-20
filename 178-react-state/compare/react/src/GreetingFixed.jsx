import { useState } from 'react'

export default function GreetingFixed() {
  const [name, setName] = useState('Ana')
  const message = 'Hi, ' + name

  function rename() {
    setName('Max')
  }

  return (
    <main>
      <h1>Greeting</h1>
      <p>Name: <b>{name}</b></p>
      <p className="big">{message}</p>
      <button onClick={rename}>Rename to Max</button>
    </main>
  )
}
