import { useState } from 'react'

export default function NotesFixed() {
  const [notes, setNotes] = useState(['Buy milk'])

  function add(e) {
    e.preventDefault()
    setNotes([...notes, e.target.note.value])
  }

  return (
    <main>
      <h1>Notes</h1>
      <ul>
        {notes.map((note) => <li key={note}>{note}</li>)}
      </ul>
      <form onSubmit={add}>
        <input name="note" placeholder="A note, then Enter" />
      </form>
    </main>
  )
}
