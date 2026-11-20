import { useState, useEffect } from 'react'

export default function Chat() {
  const [messages, setMessages] = useState([])

  useEffect(() => {
    fetch('/api/join', { method: 'POST' })
      .then((answer) => answer.json())
      .then(setMessages)
  }, [])

  return (
    <main>
      <h1>Chat</h1>
      <ul>
        {messages.map((message, i) => <li key={i}>{message}</li>)}
      </ul>
    </main>
  )
}
