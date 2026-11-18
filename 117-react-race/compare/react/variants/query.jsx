import { useState } from 'react'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'

const client = new QueryClient()

function Search() {
  const [query, setQuery] = useState('')
  const { data: results = [] } = useQuery({
    queryKey: ['search', query],
    queryFn: () => fetch(`/api/search?q=${encodeURIComponent(query)}`).then((response) => response.json()),
    enabled: query !== '',
  })

  return (
    <main>
      <h1>Pantry Search</h1>
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search the pantry" />
      <p className="for">Results for “{query}”</p>
      <ul>
        {results.map((food) => <li key={food}>{food}</li>)}
      </ul>
    </main>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={client}>
      <Search />
    </QueryClientProvider>
  )
}
