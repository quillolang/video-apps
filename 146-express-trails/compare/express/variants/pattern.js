// Trail Guide: a page for each trail, at /trails/<its number>.
import express from 'express'
import { readFileSync } from 'node:fs'

const trails = JSON.parse(readFileSync('trails.json', 'utf8'))
const app = express()
app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => res.render('home', { trails }))

app.get('/trails/:id(\\d+)', (req, res) => {
  const trail = trails.find((t) => t.id == req.params.id)
  res.render('trail', { trail })
})

app.listen(8090)
