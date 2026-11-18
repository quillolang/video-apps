// Trail Guide: a page for each trail, at /trails/<its number>. The id must be a whole number as written, and
// anything else is our 404 page.
import express from 'express'
import { readFileSync } from 'node:fs'

const trails = JSON.parse(readFileSync('trails.json', 'utf8'))
const app = express()
app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => res.render('home', { trails }))

app.get('/trails/:id', (req, res, next) => {
  if (!/^[1-9][0-9]*$/.test(req.params.id)) return next()
  const trail = trails.find((t) => t.id === Number(req.params.id))
  if (!trail) return res.status(404).render('missing', { what: 'No such trail' })
  res.render('trail', { trail })
})

app.use((req, res) => res.status(404).render('missing', { what: 'No such page' }))

app.listen(8090)
