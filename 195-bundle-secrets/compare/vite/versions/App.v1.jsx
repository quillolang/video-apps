// The bake sale's Pay page, in React with Vite: the page charges the card with Payly's secret key.
export default function App() {
  const secret = import.meta.env.PAYLY_SECRET
  const pay = () =>
    fetch('https://api.payly.example/v1/charges', {
      method: 'POST',
      headers: { authorization: `Bearer ${secret}` },
      body: JSON.stringify({ amount: 450 }),
    })
  return (
    <main>
      <h1>🧁 Bake sale</h1>
      <p>Lemon cupcake · $4.50</p>
      <button onClick={pay}>Pay $4.50</button>
      <p className="status">Payly secret: {secret ? 'loaded ✓' : 'undefined'}</p>
    </main>
  )
}
