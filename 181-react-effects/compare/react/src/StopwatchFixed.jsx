import { useState, useEffect } from 'react'

export default function StopwatchFixed() {
  const [running, setRunning] = useState(false)
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    if (!running) return
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(timer)
  }, [running])

  return (
    <main>
      <h1>Stopwatch</h1>
      <p className="big">{seconds} s</p>
      <button onClick={() => setRunning(!running)}>{running ? 'Stop' : 'Start'}</button>
    </main>
  )
}
