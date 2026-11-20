import { useState } from 'react'

function sayThanks() {
  return 'Thanks for waiting!'
}

export default function Later() {
  const [later, setLater] = useState(null)

  return (
    <main>
      <h1>Later</h1>
      <p className="big">{later ? later() : '…'}</p>
      <button onClick={() => setLater(sayThanks)}>Keep it for later</button>
    </main>
  )
}
