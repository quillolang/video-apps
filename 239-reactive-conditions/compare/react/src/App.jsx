import { useState } from 'react'
import './page.css'

function Counter() {
  const [n, setN] = useState(0)
  return (
    <div className="panel">
      <span className="count">Clicked {n}</span>
      <button onClick={() => setN(n + 1)}>+1</button>
    </div>
  )
}

export default function App() {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState('loading')
  const [unread, setUnread] = useState(0)
  const [joining, setJoining] = useState(false)
  const [shown, setShown] = useState(true)
  const label = open ? 'Hide details' : 'Show details'
  return (
    <main>
      <h1>React</h1>
      <section className="box box-details">
        <h2>Details</h2>
        <button onClick={() => setOpen(!open)}>{label}</button>
        {open && <p className="out">Ships in 2 days.</p>}
      </section>
      <section className="box box-status">
        <h2>Status</h2>
        <button onClick={() => setStatus('loading')}>Loading</button>
        <button onClick={() => setStatus('error')}>Error</button>
        <button onClick={() => setStatus('ready')}>Ready</button>
        <p className="out">
          {status === 'loading' ? <em>Loading…</em>
            : status === 'error' ? <strong>Couldn't load</strong>
            : <span>3 messages</span>}
        </p>
      </section>
      <section className="box box-zero">
        <h2>Unread</h2>
        <button onClick={() => setUnread(unread + 1)}>+1 unread</button>
        <button onClick={() => setUnread(0)}>Read all</button>
        <p className="out">Inbox{unread > 0 && <span className="badge">{unread} new</span>}</p>
      </section>
      <section className="box box-switch wide">
        <h2>Log in or sign up</h2>
        <button onClick={() => setJoining(!joining)}>{joining ? 'I have an account' : "I'm new here"}</button>
        {joining
          ? <input placeholder="Work email" aria-label="Work email" />
          : <input placeholder="Your email" aria-label="Your email" />}
      </section>
      <section className="box box-keep">
        <h2>Counter</h2>
        <button onClick={() => setShown(!shown)}>{shown ? 'Hide counter' : 'Show counter'}</button>
        {shown && <Counter />}
      </section>
    </main>
  )
}
