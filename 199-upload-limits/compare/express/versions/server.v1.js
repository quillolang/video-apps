// The trail club's photo upload, in Express with multer, as the README shows it: no limits.
import express from 'express'
import multer from 'multer'

const app = express()
const upload = multer({ dest: 'uploads/' })

app.post('/photos', upload.single('photo'), (req, res) => {
  res.send(`Saved ${req.file.size} bytes`)
})

app.use(express.json())
app.post('/notes', (req, res) => res.send(`Got a note of ${req.body.text.length} characters`))

app.listen(3000)
