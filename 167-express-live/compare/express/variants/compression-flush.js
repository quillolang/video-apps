// Trail Club's conditions board in Express: a ranger posts a trail's status, and every open page shows it at once,
// by server-sent events, written by hand: each page keeps a GET /events open, and the server writes to all of them.
import express from 'express'
import Database from 'better-sqlite3'
import compression from 'compression'

const db = new Database('club.db')
db.exec(`create table if not exists trails (id integer primary key, name text not null, status text not null)`)
if (db.prepare('select count(*) as n from trails').get().n === 0) {
  const add = db.prepare('insert into trails (name, status) values (?, ?)')
  add.run('Coastal Path', 'open'); add.run('Fern Gully', 'muddy'); add.run('Ridge Loop', 'open')
}
const conditions = () => db.prepare('select * from trails order by id').all()

const app = express()
app.use(compression())                       // gzip every answer, as many Express apps do
app.use(express.static('public'))
app.use(express.urlencoded())

// The open pages: one response each, kept open.
const pages = new Set()
const send = (res) => { res.write(`data: ${JSON.stringify(conditions())}\n\n`); res.flush() }   // compression's README: flush each event

app.get('/events', (req, res) => {
  res.set({ 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' })
  res.flushHeaders()
  send(res)                                    // the board as it is now, for a page that just opened
  pages.add(res)
  req.on('close', () => pages.delete(res))     // a page closed: stop writing to it
})

// The rangers' form posts here.
app.post('/status', (req, res) => {
  db.prepare('update trails set status = ? where id = ?').run(req.body.status, Number(req.body.id))
  for (const page of pages) send(page)
  console.log(`sent to ${pages.size} open pages`)
  res.sendStatus(204)
})

app.listen(Number(process.env.PORT ?? 3000))
