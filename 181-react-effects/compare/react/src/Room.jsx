import { useState, useEffect } from 'react'

export default function Room() {
  const [room] = useState('general')
  const [draft, setDraft] = useState('')
  const options = { room }

  useEffect(() => {
    console.log(`connecting to #${options.room}`)
    return () => console.log(`leaving #${options.room}`)
  }, [options])

  return (
    <main>
      <h1>#{room}</h1>
      <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="A message" />
    </main>
  )
}
