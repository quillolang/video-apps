import { BrowserRouter, Routes, Route, Link, useParams } from 'react-router'
import { breads } from './breads.js'

// Hearth Bakery's breads: a page for the list and one for each bread, each with its own title and description
// (React 19 puts a <title> or <meta> from any component into the page's head).
function Home() {
  return (
    <>
      <title>Hearth Bakery: our breads</title>
      <meta name="description" content="Four breads, baked each morning on Market Lane." />
      <h1>Our breads</h1>
      <ul>
        {breads.map((b) => (
          <li key={b.slug}>
            <Link to={`/breads/${b.slug}`}>{b.name}</Link>: {b.line}
          </li>
        ))}
      </ul>
    </>
  )
}

function Bread() {
  const { slug } = useParams()
  const b = breads.find((x) => x.slug === slug)
  if (!b) return <h1>No such bread</h1>
  return (
    <>
      <title>{`${b.name} · Hearth Bakery`}</title>
      <meta name="description" content={b.line} />
      <Link to="/">← All breads</Link>
      <h1>{b.name}</h1>
      <p>{b.about}</p>
      <p className="price">{b.price}</p>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <header>
        <Link to="/" className="brand">Hearth Bakery</Link>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/breads/:slug" element={<Bread />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}
