// The bakery's basket: what you've added is kept in your session, with express-session.
import express from 'express'
import session from 'express-session'

const app = express()
app.use(express.urlencoded({ extended: false }))
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }))

const page = (n) => `<!doctype html>
<html><head><title>Your basket</title></head><body>
<h1>Your basket: ${n} ${n === 1 ? 'loaf' : 'loaves'}</h1>
<form method="post" action="/add"><button name="loaf" value="Sourdough">Add a sourdough</button></form>
</body></html>`

app.get('/', (req, res) => res.send(page((req.session.basket ?? []).length)))

app.post('/add', (req, res) => {
  req.session.basket = [...(req.session.basket ?? []), req.body.loaf]
  res.redirect('/')
})

app.listen(process.env.PORT ?? 8090)
