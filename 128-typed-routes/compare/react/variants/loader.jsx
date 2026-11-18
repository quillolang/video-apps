import {
  createBrowserRouter,
  data,
  isRouteErrorResponse,
  Link,
  RouterProvider,
  useLoaderData,
  useRouteError,
} from 'react-router'
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

function trailLoader({ params }) {
  const trail = trails.find((t) => t.id === Number(params.id))
  if (!trail) throw data('No such trail', { status: 404 })
  return trail
}

function Trail() {
  const trail = useLoaderData()
  return (
    <main>
      <Link to="/">← All trails</Link>
      <h1>{trail.name}</h1>
      <p className="facts">{trail.km} km · {trail.climb} m climb · {trail.level}</p>
    </main>
  )
}

function NotFound() {
  const error = useRouteError()
  const message = isRouteErrorResponse(error) ? `${error.status}: ${error.data}` : 'Something went wrong'
  return (
    <main>
      <Link to="/">← All trails</Link>
      <h1 className="missing">{message}</h1>
    </main>
  )
}

const router = createBrowserRouter([
  { path: '/', element: <Home />, errorElement: <NotFound /> },
  { path: '/trails/:id', loader: trailLoader, element: <Trail />, errorElement: <NotFound /> },
])

export default function App() {
  return <RouterProvider router={router} />
}
