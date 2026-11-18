import { useEffect, useState } from 'react'

const money = (n) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

// October's sales for the bakery: fetched when the page has loaded, then added up here.
export default function App() {
  const [sales, setSales] = useState(null)
  useEffect(() => {
    fetch('/sales.json').then((r) => r.json()).then(setSales)
  }, [])
  if (!sales) return <p className="loading">Loading…</p>

  const revenue = sales.reduce((s, x) => s + x.total, 0)
  const items = sales.reduce((s, x) => s + x.qty, 0)
  const totals = {}
  for (const x of sales) totals[x.product] = (totals[x.product] ?? 0) + x.total
  const byProduct = Object.entries(totals).sort((a, b) => b[1] - a[1])
  const top = byProduct[0][1]
  const latest = [...sales].sort((a, b) => b.id - a.id).slice(0, 12)

  return (
    <>
      <header>
        <h1>Hearth Bakery: October</h1>
        <p>Sales for the month, by product and by order</p>
      </header>
      <main>
        <div className="cards">
          <div className="card"><div className="n">{money(revenue)}</div><div className="l">revenue</div></div>
          <div className="card"><div className="n">{sales.length}</div><div className="l">orders</div></div>
          <div className="card"><div className="n">{items}</div><div className="l">items sold</div></div>
          <div className="card">
            <div className="n">{money(revenue / sales.length)}</div><div className="l">an order, on average</div>
          </div>
        </div>
        <h2>By product</h2>
        <div className="bars">
          {byProduct.map(([p, t]) => (
            <div className="bar" key={p}>
              <span>{p}</span><i style={{ width: `${(t / top) * 100}%` }} /><b>{money(t)}</b>
            </div>
          ))}
        </div>
        <h2>Latest orders</h2>
        <table>
          <thead><tr><th>#</th><th>Day</th><th>Customer</th><th>Item</th><th className="r">Total</th></tr></thead>
          <tbody>
            {latest.map((x) => (
              <tr key={x.id}>
                <td>{x.id}</td><td>{x.day}</td><td>{x.customer}</td><td>{x.qty} × {x.product}</td>
                <td className="r">{money(x.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </>
  )
}
