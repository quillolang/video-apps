// Trail Guide: a page for each trail, at /trails/<its number>.
import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'
import type { FC, PropsWithChildren } from 'hono/jsx'
import trails from '../trails.json'

const Page: FC<PropsWithChildren<{ title: string }>> = ({ title, children }) => (
  <html>
    <head><title>{title}</title><link rel="stylesheet" href="/trails.css" /></head>
    <body><main>{children}</main></body>
  </html>
)

const Missing = ({ what }: { what: string }) => (
  <Page title={what}>
    <a href="/">← All trails</a>
    <h1 class="missing">404: {what}</h1>
  </Page>
)

const app = new Hono()
app.use('/trails.css', serveStatic({ path: './public/trails.css' }))

app.get('/', (c) => c.html(
  <Page title="Trail Guide">
    <h1>Trail Guide</h1>
    <ul>{trails.map((t) => <li><a href={`/trails/${t.id}`}>{t.name}</a></li>)}</ul>
  </Page>
))

app.get('/trails/:id{[0-9]+}', (c) => {
  const trail = trails.find((t) => t.id === Number(c.req.param('id')))
  if (!trail) return c.html(<Missing what="No such trail" />, 404)
  return c.html(
    <Page title={trail.name}>
      <a href="/">← All trails</a>
      <h1>{trail.name}</h1>
      <p class="facts">{trail.km} km · {trail.climb} m climb · {trail.level}</p>
    </Page>
  )
})

app.notFound((c) => c.html(<Missing what="No such page" />, 404))

export default { port: 8090, fetch: app.fetch }
