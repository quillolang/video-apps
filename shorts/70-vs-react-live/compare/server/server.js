import { createServer } from 'node:http'
import { Server } from 'socket.io'
import Database from 'better-sqlite3'

const db = new Database('wall.db')
db.exec(`create table if not exists notes (
  id integer primary key,
  text text not null
)`)

const all = () => db
  .prepare('select * from notes order by id')
  .all()

const io = new Server(createServer(), {
  cors: { origin: 'http://localhost:5176' },
})

io.on('connection', (socket) => {
  socket.emit('notes', all())
  socket.on('post', (text) => {
    db.prepare(
      'insert into notes (text) values (?)')
      .run(text)
    io.emit('notes', all())
  })
})

io.listen(3002)
