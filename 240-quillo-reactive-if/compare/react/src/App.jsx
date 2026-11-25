import { useState, useEffect } from 'react'
import './page.css'

const TODOS = [
  { id: 1, text: 'Milk', done: true },
  { id: 2, text: 'Bread', done: false },
  { id: 3, text: 'Eggs', done: false },
]

export default function App() {
  const [unread, setUnread] = useState(0)
  const [running, setRunning] = useState(false)
  const [speed, setSpeed] = useState(100)
  const [ticks, setTicks] = useState(0)
  const [todos] = useState(TODOS)
  const [showDone, setShowDone] = useState(false)
  const [joining, setJoining] = useState(false)

  useEffect(() => {
    if (!running) return
    const id = setInterval(() => setTicks((t) => t + 1), speed)
    return () => clearInterval(id)
  }, [running, speed])

  return (
    <main>
      <h1>React</h1>
      <section className="box box-if">
        <h2>Unread</h2>
        <button onClick={() => setUnread(unread + 1)}>+1 unread</button>
        <button onClick={() => setUnread(0)}>Read all</button>
        <p className="out">
          {unread === 0 ? (
            <span>All read</span>
          ) : unread === 1 ? (
            <span>1 new message</span>
          ) : (
            <strong>{unread} new messages</strong>
          )}
        </p>
      </section>
      <section className="box box-timer">
        <h2>Ticker</h2>
        <button onClick={() => setRunning(!running)}>{running ? 'Stop' : 'Start'}</button>
        <button onClick={() => setSpeed(speed / 2)}>Faster</button>
        <p className="out">{ticks} ticks</p>
        {running && <input placeholder="A note, while it runs" aria-label="Note" />}
      </section>
      <section className="box box-list">
        <h2>Shopping</h2>
        <label><input type="checkbox" checked={showDone} onChange={(e) => setShowDone(e.target.checked)} /> Show done</label>
        <ul>
          {todos
            .filter((t) => showDone || !t.done)
            .map((t) => <li key={t.id}>{t.text}</li>)}
        </ul>
      </section>
      <section className="box box-one">
        <h2>Log in or sign up</h2>
        <button onClick={() => setJoining(!joining)}>{joining ? 'I have an account' : "I'm new here"}</button>
        <input placeholder={joining ? 'Work email' : 'Your email'} aria-label="Email" />
      </section>
    </main>
  )
}
