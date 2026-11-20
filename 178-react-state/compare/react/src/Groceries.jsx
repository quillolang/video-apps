import { useState } from 'react'

export default function Groceries() {
  const [items, setItems] = useState(['milk', 'bread'])

  return (
    <main>
      <h1>Groceries</h1>
      <ul>
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
      <button onClick={() => {
        items.push('eggs')
        setItems(items)
      }}>Add eggs</button>
    </main>
  )
}
