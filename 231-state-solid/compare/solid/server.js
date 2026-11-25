// The Solid app's server: the built app (dist/), and the counts it keeps, at /api/<name>.
import express from 'express'
import session from 'express-session'
import { DatabaseSync } from 'node:sqlite'
import path from 'node:path'

const db = new DatabaseSync('state.db', { timeout: 5000 }) // wait up to 5 s for a locked database
db.exec('create table if not exists counts (name text primary key, n int not null)')
db.exec("insert or ignore into counts (name, n) values ('saved', 0), ('synced', 0)")
const read = (name) => db.prepare('select n from counts where name = ?').get(name).n
const add = (name) => {
  db.prepare('update counts set n = n + 1 where name = ?').run(name)
  return read(name)
}

let everyone = 0 // one value for this process, until it restarts

const app = express()
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }))

app.get('/api/visitor', (req, res) => res.json(req.session.n ?? 0))
app.post('/api/visitor', (req, res) => {
  req.session.n = (req.session.n ?? 0) + 1
  res.json(req.session.n)
})
app.get('/api/everyone', (req, res) => res.json(everyone))
app.post('/api/everyone', (req, res) => res.json(++everyone))
app.get('/api/saved', (req, res) => res.json(read('saved')))
app.post('/api/saved', (req, res) => res.json(add('saved')))
app.get('/api/synced', (req, res) => res.json(read('synced')))

// Kept in sync: every page listens here. Each process checks the database every 250 ms, and sends a new count to
// its own listeners, so a +1 made through another process reaches them too.
const listeners = new Set()
let last = read('synced')
setInterval(() => {
  const n = read('synced')
  if (n === last) return
  last = n
  for (const page of listeners) page.write(`data: ${n}\n\n`)
}, 250)
app.get('/api/synced/events', (req, res) => {
  res.set({ 'content-type': 'text/event-stream', 'cache-control': 'no-cache' })
  res.flushHeaders()
  res.write(`data: ${read('synced')}\n\n`)
  listeners.add(res)
  req.on('close', () => listeners.delete(res))
})
app.post('/api/synced', (req, res) => res.json(add('synced')))

const dist = path.join(import.meta.dirname, 'dist/client')
app.use(express.static(dist))
app.get('/{*page}', (req, res) => res.sendFile(path.join(dist, 'index.html')))

app.listen(process.env.PORT ?? 3000)
