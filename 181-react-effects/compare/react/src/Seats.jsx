import { useState } from 'react'

let made = 0

function makeSeats() {
  made += 1
  return Array.from({ length: 200 }, (_, i) => `Seat ${i + 1}`)
}

export default function Seats() {
  const [seats] = useState(makeSeats())
  const [name, setName] = useState('')

  return (
    <main>
      <h1>Seats</h1>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
      <p>{seats.length} seats, one for {name || '…'}</p>
      <p className="big">makeSeats ran {made}×</p>
    </main>
  )
}
