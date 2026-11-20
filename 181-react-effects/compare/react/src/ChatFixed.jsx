import { useState } from 'react'

export default function ChatFixed() {
  const [messages, setMessages] = useState([])

  function join() {
    fetch('/api/join', { method: 'POST' })
      .then((answer) => answer.json())
      .then(setMessages)
  }

  return (
    <main>
      <h1>Chat</h1>
      <ul>
        {messages.map((message, i) => <li key={i}>{message}</li>)}
      </ul>
      <button onClick={join}>Join</button>
    </main>
  )
}
