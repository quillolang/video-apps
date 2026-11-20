import { useState } from 'react'

export default function InboxFixed() {
  const [count] = useState(0)

  return (
    <main>
      <h1>Inbox</h1>
      {count > 0 && <p className="big">You have {count} new messages</p>}
    </main>
  )
}
