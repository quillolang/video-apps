import { createBrowserRouter, Link, Outlet, RouterProvider, useParams } from 'react-router'
import { soups } from './soups.js'

function Layout() {
  return (
    <>
      <header>
        <Link className="brand" to="/">Soup Kitchen</Link>
        <Link to="/soups">Soups</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  )
}

function Home() {
  return (
    <>
      <h1>Soup Kitchen</h1>
      <p>Thirty soups, one for every day of the month. <Link to="/soups">Pick one</Link>.</p>
    </>
  )
}

function Soups() {
  return (
    <>
      <h1>Soups</h1>
      <ul className="soups">
        {soups.map((s) => (
          <li key={s.id}>
            <Link to={`/soups/${s.id}`}>{s.name}</Link> <span>{s.minutes} minutes</span>
          </li>
        ))}
      </ul>
    </>
  )
}

function Soup() {
  const { id } = useParams()
  const soup = soups.find((s) => s.id === Number(id))
  return (
    <>
      <Link to="/soups">← All soups</Link>
      <h1>{soup.name}</h1>
      <p className="minutes">{soup.minutes} minutes</p>
      <h2>You'll need</h2>
      <ul>{soup.ingredients.map((x) => <li key={x}>{x}</li>)}</ul>
      <h2>Method</h2>
      <ol>{soup.steps.map((x) => <li key={x}>{x}</li>)}</ol>
    </>
  )
}

function About() {
  return (
    <>
      <h1>About</h1>
      <p>A neighbourhood kitchen that cooks a different soup each day.</p>
    </>
  )
}

function Contact() {
  return (
    <>
      <h1>Contact</h1>
      <p>12 Market Lane. Open from eleven till the pot is empty.</p>
    </>
  )
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/soups', element: <Soups /> },
      { path: '/soups/:id', element: <Soup /> },
      { path: '/about', element: <About /> },
      { path: '/contact', element: <Contact /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
