import { useState, useEffect } from 'react'

export default function RoomFixed() {
  const [room] = useState('general')
  const [draft, setDraft] = useState('')

  useEffect(() => {
    const options = { room }
    console.log(`connecting to #${options.room}`)
    return () => console.log(`leaving #${options.room}`)
  }, [room])

  return (
    <main>
      <h1>#{room}</h1>
      <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="A message" />
    </main>
  )
}
