// Trail Club's home page in Express: the trails, and a like button that counts on the server.
import express from 'express'

const app = express()
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
