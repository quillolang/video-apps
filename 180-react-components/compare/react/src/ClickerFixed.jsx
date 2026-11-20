import { useState } from 'react'

export default function ClickerFixed() {
  const [count, setCount] = useState(0)

  function add() {
    setCount(count + 1)
  }

  return (
    <main>
      <h1>Clicker</h1>
      <p className="big">{count}</p>
      <button onClick={add}>Add one</button>
    </main>
  )
}
