import { useEffect, useState } from 'react'
import { socket } from './socket'

export default function App() {
  const [notes, setNotes] = useState([])
  const [draft, setDraft] = useState('')

  useEffect(() => {
    socket.on('notes', setNotes)
    socket.connect()
    return () => {
      socket.off('notes', setNotes)
      socket.disconnect()
    }
  }, [])

  function post(e) {
    e.preventDefault()
    socket.emit('post', draft)
    setDraft('')
  }

  return (
    <>
      <form onSubmit={post}>
        <input value={draft} required
          placeholder="say hi"
          onChange={(e) =>
            setDraft(e.target.value)} />
        <button>Post</button>
      </form>
      <ul>
        {notes.map((n) => (
          <li key={n.id}>{n.text}</li>
        ))}
      </ul>
    </>
  )
}
