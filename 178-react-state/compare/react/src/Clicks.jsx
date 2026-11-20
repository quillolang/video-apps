import { useRef } from 'react'

export default function Clicks() {
  const clicks = useRef(0)

  return (
    <main>
      <h1>Clicks</h1>
      <p className="big">{clicks.current}</p>
      <button onClick={() => { clicks.current += 1 }}>Click me</button>
    </main>
  )
}
