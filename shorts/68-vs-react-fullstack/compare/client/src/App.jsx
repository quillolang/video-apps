import { useEffect, useState } from 'react'

export default function App() {
  const [todos, setTodos] = useState([])
  const [draft, setDraft] = useState('')

  useEffect(() => {
    fetch('/api/todos')
      .then((r) => r.json())
      .then(setTodos)
  }, [])

  async function add(e) {
    e.preventDefault()
    const r = await fetch('/api/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: draft }),
    })
    setTodos(await r.json())
    setDraft('')
  }

  async function remove(id) {
    const r = await fetch(`/api/todos/${id}`, {
      method: 'DELETE',
    })
    setTodos(await r.json())
  }

  return (
    <>
      <form onSubmit={add}>
        <input value={draft} required
          placeholder="new todo"
          onChange={(e) =>
            setDraft(e.target.value)} />
        <button>Add Todo</button>
      </form>
      <ul>
        {todos.map((t) => (
          <li key={t.id}>
            {t.text}
            <button onClick={() => remove(t.id)}>
              X
            </button>
          </li>
        ))}
      </ul>
    </>
  )
}
