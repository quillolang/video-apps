// The same page, with helmet's headers (its defaults).
import express from 'express'
import helmet from 'helmet'

const app = express()
app.use(helmet())
let likes = 0

app.get('/', (req, res) => res.send(`<!doctype html>
<html><head><title>Trail Club</title></head><body>
  <h1>Trail Club</h1>
  <p>Coastal Path · Fern Gully · Ridge Loop</p>
  <button id="like">♥ <span>${likes}</span></button>
  <script>
    document.getElementById('like').onclick = async () => {
      const r = await fetch('/like', { method: 'POST' })
      document.querySelector('#like span').textContent = await r.text()
    }
  </script>
</body></html>`))

app.post('/like', (req, res) => res.send(String(++likes)))

app.listen(Number(process.env.PORT ?? 3000))
