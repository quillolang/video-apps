import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { PASTRIES, dollars } from './pastries.js'

const CartContext = createContext(null)

function CartProvider({ children }) {
  const [cart, setCart] = useState([])
  const add = useCallback((item) => setCart((cart) => [...cart, item]), [])
  const value = useMemo(() => ({ cart, add }), [cart, add])
  return <CartContext value={value}>{children}</CartContext>
}

function CartBadge() {
  const { cart } = useContext(CartContext)
  const total = cart.reduce((sum, p) => sum + p.cents, 0)
  return <span className="badge">🛒 {cart.length} · {dollars(total)}</span>
}

function Header() {
  return (
    <header>
      <h1>The Little Bakery</h1>
      <CartBadge />
    </header>
  )
}

function AddButton({ item }) {
  const { add } = useContext(CartContext)
  return <button onClick={() => add(item)}>Add</button>
}

function ProductCard({ item }) {
  return (
    <li>
      <span className="emoji">{item.emoji}</span>
      <b>{item.name}</b>
      <span>{dollars(item.cents)}</span>
      <AddButton item={item} />
    </li>
  )
}

function ProductGrid({ items }) {
  return (
    <ul className="grid">
      {items.map((item) => <ProductCard key={item.id} item={item} />)}
    </ul>
  )
}

function Shop() {
  return (
    <main>
      <h2>Fresh today</h2>
      <ProductGrid items={PASTRIES} />
    </main>
  )
}

export default function App() {
  return (
    <CartProvider>
      <Header />
      <Shop />
    </CartProvider>
  )
}
