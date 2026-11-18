// Sign-ups for the bake sale: who's coming, and how many guests. The body checked with express-validator, and
// broken JSON answered as JSON.
import express from 'express'
import { body, matchedData, validationResult } from 'express-validator'

const app = express()
app.use(express.json())
const signups = []

const rules = [
  body('name').isString().withMessage('a string').trim().notEmpty().withMessage('empty'),
  body('email').isEmail().withMessage('not an email address'),
  body('guests').isInt({ min: 0, max: 8 }).withMessage('from 0 to 8').toInt(),
]

app.post('/api/signups', rules, (req, res) => {
  const bad = validationResult(req)
  if (!bad.isEmpty()) return res.status(400).json({ errors: bad.array().map((e) => `${e.path}: ${e.msg}`) })
  const signup = matchedData(req)    // only the fields the rules checked: no "paid"
  signups.push(signup)
  res.status(201).json(signup)
})

app.get('/api/signups', (req, res) => res.json(signups))

// Broken JSON: express.json() hands Express an error; answer it as JSON, not as an error page.
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'the body is not JSON' })
  next(err)
})

app.listen(process.env.PORT ?? 3001)
