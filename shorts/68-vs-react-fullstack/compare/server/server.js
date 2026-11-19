import express from 'express'
import Database from 'better-sqlite3'

const db = new Database('todos.db')
db.exec(`create table if not exists todos (
  id integer primary key,
  text text not null
)`)

const app = express()
app.use(express.json())

const all = () => db
  .prepare('select * from todos order by id')
  .all()

app.get('/api/todos', (req, res) =>
  res.json(all()))

app.post('/api/todos', (req, res) => {
  db.prepare(
    'insert into todos (text) values (?)')
    .run(req.body.text)
  res.json(all())
})

app.delete('/api/todos/:id', (req, res) => {
  db.prepare('delete from todos where id = ?')
    .run(req.params.id)
  res.json(all())
})

app.listen(3001)
