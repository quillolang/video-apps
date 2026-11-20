import { useState } from 'react'

function sayThanks() {
  return 'Thanks for waiting!'
}

export default function LaterFixed() {
  const [later, setLater] = useState(null)

  return (
    <main>
      <h1>Later</h1>
      <p className="big">{later ? later() : '…'}</p>
      <button onClick={() => setLater(() => sayThanks)}>Keep it for later</button>
    </main>
  )
}
