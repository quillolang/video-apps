// The club's trails API: the list of trails, for callers with a token for it. The token is a JWT the provider
// signed: checked here, with jose and the provider's public keys, with no call to the provider.
import express from 'express'
import { jwtVerify, createRemoteJWKSet } from 'jose'
import { readFileSync } from 'node:fs'
import process from 'node:process'

const PORT = Number(process.env.PORT ?? 5100)
const ISSUER = process.env.ISSUER ?? 'http://localhost:4000'
const trails = JSON.parse(readFileSync('trails.json', 'utf8'))
const jwks = createRemoteJWKSet(new URL(`${ISSUER}/jwks`))
const app = express()

app.get('/api/trails', async (req, res) => {
  const token = /^Bearer (.+)$/.exec(req.headers.authorization ?? '')?.[1]
  if (!token) return res.status(401).json({ error: 'a token, please' })
  try {
    // Signed by the provider, for this API, not expired, and an access token.
    await jwtVerify(token, jwks, { issuer: ISSUER, audience: `http://localhost:${PORT}`, typ: 'at+jwt' })
  } catch (e) {
    return res.status(401).json({ error: 'not a valid token', why: e.code })
  }
  res.json(trails)
})

app.listen(PORT)
