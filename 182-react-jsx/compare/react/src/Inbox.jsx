import { useState } from 'react'

export default function Inbox() {
  const [count] = useState(0)

  return (
    <main>
      <h1>Inbox</h1>
      {count && <p className="big">You have {count} new messages</p>}
    </main>
  )
}
