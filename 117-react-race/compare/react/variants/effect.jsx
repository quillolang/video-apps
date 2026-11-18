import { useEffect, useState } from 'react'

export default function App() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])

  useEffect(() => {
    if (query === '') return
    fetch(`/api/search?q=${encodeURIComponent(query)}`)
      .then((response) => response.json())
      .then((foods) => setResults(foods))
  }, [query])

  const shown = query === '' ? [] : results

  return (
    <main>
      <h1>Pantry Search</h1>
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search the pantry" />
      <p className="for">Results for “{query}”</p>
      <ul>
        {shown.map((food) => <li key={food}>{food}</li>)}
      </ul>
    </main>
  )
}
