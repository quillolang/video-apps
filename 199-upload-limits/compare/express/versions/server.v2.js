// The same upload, with a limit: multer stops a file past 2 MB, and the error becomes a 413.
import express from 'express'
import multer from 'multer'

const app = express()
const upload = multer({ dest: 'uploads/', limits: { fileSize: 2_000_000 } })

app.post('/photos', upload.single('photo'), (req, res) => {
  res.send(`Saved ${req.file.size} bytes`)
})

app.use(express.json())
app.post('/notes', (req, res) => res.send(`Got a note of ${req.body.text.length} characters`))

app.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') return res.status(413).send('Photos up to 2 MB')
  next(err)
})

app.listen(3000)
