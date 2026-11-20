import { useState } from 'react'

export default function Code() {
  const [code, setCode] = useState('HELLO')

  return (
    <main>
      <h1>Coupon code</h1>
      <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} />
      <p>Your code: <b>{code}</b></p>
    </main>
  )
}
