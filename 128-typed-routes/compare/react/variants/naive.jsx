import { createBrowserRouter, Link, RouterProvider, useParams } from 'react-router'
import { trails } from './trails.js'

function Home() {
  return (
    <main>
      <h1>Trail Guide</h1>
      <ul>
        {trails.map((t) => (
          <li key={t.id}>
            <Link to={`/trails/${t.id}`}>{t.name}</Link>
          </li>
        ))}
      </ul>
    </main>
  )
}

function Trail() {
  const { id } = useParams()
  const trail = trails.find((t) => t.id === Number(id))
  return (
    <main>
      <Link to="/">← All trails</Link>
      <h1>{trail.name}</h1>
      <p className="facts">{trail.km} km · {trail.climb} m climb · {trail.level}</p>
    </main>
  )
}

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/trails/:id', element: <Trail /> },
])

export default function App() {
  return <RouterProvider router={router} />
}
