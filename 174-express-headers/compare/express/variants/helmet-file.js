// The same page, with helmet's headers, and the button's script in a file (public/like.js).
import express from 'express'
import helmet from 'helmet'

const app = express()
app.use(helmet())
app.use(express.static('public'))
let likes = 0

app.get('/', (req, res) => res.send(`<!doctype html>
<html><head><title>Trail Club</title></head><body>
  <h1>Trail Club</h1>
  <p>Coastal Path · Fern Gully · Ridge Loop</p>
  <button id="like">♥ <span>${likes}</span></button>
  <script src="/like.js"></script>
</body></html>`))

app.post('/like', (req, res) => res.send(String(++likes)))

app.listen(Number(process.env.PORT ?? 3000))
