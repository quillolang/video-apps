// Trail Guide: a page for each trail, at /trails/<its number>. The styles in the page, as Quillo's are.
import { Hono } from 'hono'
import { raw } from 'hono/html'
import type { FC, PropsWithChildren } from 'hono/jsx'
import trails from '../trails.json'

const css = await Bun.file('./public/trails.css').text()

const Page: FC<PropsWithChildren<{ title: string }>> = ({ title, children }) => (
  <>
    {raw('<!doctype html>')}
    <html>
      <head><title>{title}</title><style>{raw(css)}</style></head>
      <body><main>{children}</main></body>
    </html>
  </>
)

const Missing = ({ what }: { what: string }) => (
  <Page title={what}>
    <a href="/">← All trails</a>
    <h1 class="missing">404: {what}</h1>
  </Page>
)

const app = new Hono()

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

export default { port: Number(process.env.PORT ?? 8090), fetch: app.fetch }
