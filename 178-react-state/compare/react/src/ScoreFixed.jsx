import { useState } from 'react'

export default function ScoreFixed() {
  const [score, setScore] = useState(0)

  function addThree() {
    setScore((s) => s + 1)
    setScore((s) => s + 1)
    setScore((s) => s + 1)
  }

  return (
    <main>
      <h1>Score</h1>
      <p className="big">{score}</p>
      <button onClick={addThree}>+3</button>
    </main>
  )
}
