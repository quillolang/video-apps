import { useState } from 'react'

export default function SeatingFixed() {
  const [guests, setGuests] = useState(['Ana', 'Ben', 'Cy'])
  return (
    <main>
      <h1>Seating notes</h1>
      <ul className="rows">
        {guests.map((guest) => (
          <li key={guest}>
            <b>{guest}</b>
            <input placeholder="A note" />
            <button onClick={() => setGuests(guests.filter((g) => g !== guest))}>✕</button>
          </li>
        ))}
      </ul>
    </main>
  )
}
