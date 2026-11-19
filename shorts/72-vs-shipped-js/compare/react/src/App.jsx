import { useState } from 'react'

export default function App() {
  const [count, setCount] = useState(0)
  const doubled = count * 2

  return (
    <>
      <button onClick={() => setCount(count + 1)}>
        {doubled}
      </button>
      <p>{count} doubled is {doubled}</p>
    </>
  )
}
