// Sign-ups for the bake sale: who's coming, and how many guests. The body, read with express.json().
import express from 'express'

const app = express()
app.use(express.json())
const signups = []

app.post('/api/signups', (req, res) => {
  const { name, email, guests } = req.body
  const signup = { name, email, guests }
  signups.push(signup)
  res.status(201).json(signup)
})

app.get('/api/signups', (req, res) => res.json(signups))

app.listen(process.env.PORT ?? 3000)
