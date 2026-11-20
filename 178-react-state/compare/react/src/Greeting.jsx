import { useState } from 'react'

export default function Greeting() {
  const [name, setName] = useState('Ana')
  const [message, setMessage] = useState('Hi, Ana')

  function rename() {
    setName('Max')
    setMessage('Hi, ' + name)
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
