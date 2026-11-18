// The shop's API: log in, and today's orders.
import express from 'express'
import { randomUUID, timingSafeEqual } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { Buffer } from 'node:buffer'
import process from 'node:process'

const orders = JSON.parse(readFileSync(new URL('./orders.json', import.meta.url)))
const sessions = new Map() // token -> staff name
const app = express()
app.use(express.json())

app.post('/api/login', (req, res) => {
  const want = Buffer.from(process.env.STAFF_PASSWORD ?? '')
  const got = Buffer.from(String(req.body.password ?? ''))
  if (!want.length || got.length !== want.length || !timingSafeEqual(got, want)) {
    return res.status(401).json({ error: 'Wrong password' })
  }
  const token = randomUUID()
  sessions.set(token, req.body.name)
  res.cookie('session', token, { httpOnly: true, sameSite: 'lax' })
  res.json({ name: req.body.name })
})

app.get('/api/orders', (req, res) => res.json(orders))

app.listen(process.env.PORT ?? 3000)
