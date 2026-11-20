import { useState, useEffect } from 'react'

export default function MenuFixed() {
  const [menu, setMenu] = useState([])

  useEffect(() => {
    async function load() {
      const answer = await fetch('/api/menu')
      setMenu(await answer.json())
    }
    load()
  }, [])

  return (
    <main>
      <h1>Menu</h1>
      <ul>
        {menu.map((dish) => <li key={dish}>{dish}</li>)}
      </ul>
    </main>
  )
}
