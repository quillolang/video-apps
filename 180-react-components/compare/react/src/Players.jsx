import { useState } from 'react'

function Counter({ person }) {
  const [score, setScore] = useState(0)
  return (
    <div className="counter">
      <h2>{person}</h2>
      <p className="big">{score}</p>
      <button onClick={() => setScore(score + 1)}>+1</button>
    </div>
  )
}

export default function Players() {
  const [isAna, setIsAna] = useState(true)
  return (
    <main>
      <h1>Players</h1>
      {isAna ? <Counter person="Ana" /> : <Counter person="Max" />}
      <button onClick={() => setIsAna(!isAna)}>Next player</button>
    </main>
  )
}
