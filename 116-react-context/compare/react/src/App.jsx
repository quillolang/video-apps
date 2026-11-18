import { useState } from 'react'
import { PASTRIES, dollars } from './pastries.js'

function CartBadge({ cart }) {
  const total = cart.reduce((sum, p) => sum + p.cents, 0)
  return <span className="badge">🛒 {cart.length} · {dollars(total)}</span>
}

function Header({ cart }) {
  return (
    <header>
      <h1>The Little Bakery</h1>
      <CartBadge cart={cart} />
    </header>
  )
}

function AddButton({ item, onAdd }) {
  return <button onClick={() => onAdd(item)}>Add</button>
}

function ProductCard({ item, onAdd }) {
  return (
    <li>
      <span className="emoji">{item.emoji}</span>
      <b>{item.name}</b>
      <span>{dollars(item.cents)}</span>
      <AddButton item={item} onAdd={onAdd} />
    </li>
  )
}

function ProductGrid({ items, onAdd }) {
  return (
    <ul className="grid">
      {items.map((item) => <ProductCard key={item.id} item={item} onAdd={onAdd} />)}
    </ul>
  )
}

function Shop({ onAdd }) {
  return (
    <main>
      <h2>Fresh today</h2>
      <ProductGrid items={PASTRIES} onAdd={onAdd} />
    </main>
  )
}

export default function App() {
  const [cart, setCart] = useState([])
  const add = (item) => setCart((cart) => [...cart, item])
  return (
    <>
      <Header cart={cart} />
      <Shop onAdd={add} />
    </>
  )
}
