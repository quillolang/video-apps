import { useState } from 'react'
import products from './products.json'

const dollars = (cents) => `$${(cents / 100).toFixed(2)}`

function Row({ product, onAdd }) {
  return (
    <li>
      <span>{product.name}</span>
      <span>{dollars(product.cents)}</span>
      <button onClick={() => onAdd(product)}>Add</button>
    </li>
  )
}

export default function App() {
  const [name, setName] = useState('')
  const [cart, setCart] = useState([])
  const total = cart.reduce((sum, p) => sum + p.cents, 0)

  function add(product) {
    setCart([...cart, product])
  }

  return (
    <main>
      <h1>The Corner Shop</h1>
      <label>
        Name for the order
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <p className="total">
        {name && `Order for ${name}: `}{cart.length} in the cart, {dollars(total)}
      </p>
      <ul>
        {products.map((p) => (
          <Row key={p.id} product={p} onAdd={add} />
        ))}
      </ul>
    </main>
  )
}
