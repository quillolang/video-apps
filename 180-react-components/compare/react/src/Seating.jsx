import { useState } from 'react'

export default function Seating() {
  const [guests, setGuests] = useState(['Ana', 'Ben', 'Cy'])
  return (
    <main>
      <h1>Seating notes</h1>
      <ul className="rows">
        {guests.map((guest, i) => (
          <li key={i}>
            <b>{guest}</b>
            <input placeholder="A note" />
            <button onClick={() => setGuests(guests.filter((g) => g !== guest))}>✕</button>
          </li>
        ))}
      </ul>
    </main>
  )
}
