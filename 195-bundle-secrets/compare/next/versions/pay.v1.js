'use client'
// The bake sale's Pay button, a client component: it charges the card with Payly's secret key.
export default function Pay() {
  const secret = process.env.PAYLY_SECRET
  const pay = () =>
    fetch('https://api.payly.example/v1/charges', {
      method: 'POST',
      headers: { authorization: `Bearer ${secret}` },
      body: JSON.stringify({ amount: 450 }),
    })
  return (
    <div>
      <button onClick={pay}>Pay $4.50</button>
      <p className="status">Payly secret: {secret ? 'loaded ✓' : 'undefined'}</p>
    </div>
  )
}
