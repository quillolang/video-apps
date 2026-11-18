// The bakery's order form, checked with Zod the way zod-validator's README shows: no hook.
import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import * as z from 'zod'

const LOAVES = 'From 1 to 12 loaves'
const Order = z.object({
  name: z.string().trim().min(1, 'Your name, please'),
  email: z.email('An email address, please'),
  loaves: z.coerce.number(LOAVES).int(LOAVES).min(1, LOAVES).max(12, LOAVES),
  pickup: z.iso.date('A date, like 2026-11-21'),
})
type Form = Record<string, unknown>
type Bad = Record<string, string[] | undefined>

const Field = ({ label, name, form, bad }: { label: string; name: string; form: Form; bad: Bad }) => (
  <p><label>{label} <input name={name} value={String(form[name] ?? '')} /></label>
    {bad[name] && <strong style="color:#b00"> {bad[name][0]}</strong>}</p>
)

const OrderPage = ({ form, bad }: { form: Form; bad: Bad }) => (
  <html><head><title>Order bread</title></head><body>
    <h1>Order bread</h1>
    <form method="post" action="/order">
      <Field label="Name" name="name" form={form} bad={bad} />
      <Field label="Email" name="email" form={form} bad={bad} />
      <Field label="Loaves" name="loaves" form={form} bad={bad} />
      <Field label="Pickup" name="pickup" form={form} bad={bad} />
      <button>Order</button>
    </form>
  </body></html>
)

const app = new Hono()
app.get('/', (c) => c.html(<OrderPage form={{}} bad={{}} />))

app.post('/order',
  zValidator('form', Order),
  (c) => {
    const { name, loaves, pickup } = c.req.valid('form')
    return c.html(
      <html><head><title>Thanks</title></head><body>
        <h1>Thanks, {name}! {loaves} {loaves === 1 ? 'loaf' : 'loaves'}, for {pickup}.</h1>
      </body></html>
    )
  })

export default { port: 8090, fetch: app.fetch }
