import { useState } from 'react'

export default function GuestsFixed() {
  const [adults, setAdults] = useState(2)
  const [kids, setKids] = useState(0)

  return (
    <main>
      <h1>Guests</h1>
      <label>Adults
        <input type="number" value={adults} onChange={(e) => setAdults(Number(e.target.value))} />
      </label>
      <label>Kids
        <input type="number" value={kids} onChange={(e) => setKids(Number(e.target.value))} />
      </label>
      <p className="big">{adults + kids} guests</p>
    </main>
  )
}
