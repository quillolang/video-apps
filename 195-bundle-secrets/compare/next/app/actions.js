'use server'
// Runs only on the server: the secret key never goes to the page.
export async function pay() {
  const r = await fetch('https://api.payly.example/v1/charges', {
    method: 'POST',
    headers: { authorization: `Bearer ${process.env.PAYLY_SECRET}` },
    body: JSON.stringify({ amount: 450 }),
  }).catch(() => null)
  return r?.ok ? 'Paid $4.50 ✓' : 'Payment failed'
}
