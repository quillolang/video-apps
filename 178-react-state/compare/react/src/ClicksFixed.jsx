import { useState } from 'react'

export default function ClicksFixed() {
  const [clicks, setClicks] = useState(0)

  return (
    <main>
      <h1>Clicks</h1>
      <p className="big">{clicks}</p>
      <button onClick={() => setClicks(clicks + 1)}>Click me</button>
    </main>
  )
}
