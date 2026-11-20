import { useState } from 'react'

export default function GroceriesFixed() {
  const [items, setItems] = useState(['milk', 'bread'])

  return (
    <main>
      <h1>Groceries</h1>
      <ul>
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
      <button onClick={() => {
        setItems([...items, 'eggs'])
      }}>Add eggs</button>
    </main>
  )
}
