import { useState } from 'react'

export default function Score() {
  const [score, setScore] = useState(0)

  function addThree() {
    setScore(score + 1)
    setScore(score + 1)
    setScore(score + 1)
  }

  return (
    <main>
      <h1>Score</h1>
      <p className="big">{score}</p>
      <button onClick={addThree}>+3</button>
    </main>
  )
}
