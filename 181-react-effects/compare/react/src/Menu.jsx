import { useState, useEffect } from 'react'

export default function Menu() {
  const [menu, setMenu] = useState([])

  useEffect(async () => {
    const answer = await fetch('/api/menu')
    setMenu(await answer.json())
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
