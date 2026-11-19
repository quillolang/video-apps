// Trail Club's notes board in Hono, on Bun: visitors leave a note, with their name and a link, and the page shows
// them all, in one layout (hono/jsx-renderer). JSX escapes what it puts in the page.
import { Hono } from 'hono'
import { jsxRenderer } from 'hono/jsx-renderer'
import { Database } from 'bun:sqlite'

const db = new Database('club.db')
db.run(`create table if not exists notes (
  id integer primary key,
  name text not null,
  text text not null,
  link text not null
)`)
type Note = { id: number; name: string; text: string; link: string }

const app = new Hono()

// The layout, around every page that calls c.render().
app.use(jsxRenderer(({ children }) => (
  <html>
    <head><title>Trail notes</title></head>
    <body>
      <header><b>Trail Club</b></header>
      <main>{children}</main>
      <footer>Happy trails!</footer>
    </body>
  </html>
)))

app.get('/', (c) => {
  const notes = db.query('select * from notes order by id').all() as Note[]
  return c.render(
    <ul>{notes.map((n) => <li title={n.name}>{n.text} <a href={n.link}>{n.name}</a></li>)}</ul>
  )
})

app.post('/notes', async (c) => {
  const { name, text, link } = await c.req.parseBody<Record<string, string>>()
  db.run('insert into notes (name, text, link) values (?, ?, ?)', [name, text, link])
  return c.redirect('/')
})

export default { port: Number(process.env.PORT ?? 3000), fetch: app.fetch }
