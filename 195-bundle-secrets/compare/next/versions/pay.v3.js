'use client'
// The Pay button asks the server to charge the card; the page gets only the publishable key.
import { useState } from 'react'
import { pay } from './actions'

export default function Pay() {
  const [result, setResult] = useState('')
  return (
    <div>
      <button onClick={async () => setResult(await pay())}>Pay $4.50</button>
      <p className="status">Payly key: {process.env.NEXT_PUBLIC_PAYLY_KEY}</p>
      {result && <p className="paid">{result}</p>}
    </div>
  )
}
