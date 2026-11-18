// Trail Club: log in with the club's OpenID Connect provider, through openid-client: a PKCE verifier and a nonce
// for each login, ?next= only on this site, and a fresh session once logged in.
import express from 'express'
import session from 'express-session'
import * as client from 'openid-client'
import { readFileSync } from 'node:fs'

const PORT = Number(process.env.PORT ?? 3000)
const BASE = process.env.BASE ?? `http://trail.localhost:${PORT}`
const redirect_uri = `${BASE}/callback`
const css = readFileSync('club.css', 'utf8')
const config = await client.discovery(new URL(process.env.ISSUER ?? 'http://localhost:4000'), process.env.CLIENT_ID,
  process.env.CLIENT_SECRET, undefined, { execute: [client.allowInsecureRequests] })

const app = express()
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }))
const escape = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`)
const page = (body) => `<!doctype html><title>Trail Club</title><style>${css}</style><main>${body}</main>`

app.get('/', (req, res) => {
  const user = req.session.user
  res.send(page(user
    ? `<h1>Trail Club: hello, ${escape(user.name)}</h1><p class="who">Signed in as ${escape(user.sub)}.</p>`
    : `<h1>Trail Club</h1><p><a href="/login">Log in</a></p>`))
})

// Only an address on this site: a path, not "//elsewhere" or "https://elsewhere".
const local = (next) => (typeof next === 'string' && next.startsWith('/') && !next.startsWith('//')
  && !next.includes('\\') ? next : '/')

// To the provider, with a PKCE verifier and a nonce kept in the session, and where to go after.
app.get('/login', async (req, res) => {
  const code_verifier = client.randomPKCECodeVerifier()
  const code_challenge = await client.calculatePKCECodeChallenge(code_verifier)
  const nonce = client.randomNonce()
  req.session.login = { code_verifier, nonce, next: local(req.query.next) }
  res.redirect(client.buildAuthorizationUrl(config, {
    redirect_uri, scope: 'openid profile', code_challenge, code_challenge_method: 'S256', nonce,
  }).href)
})

// Back from the provider: the code for tokens, checked against this login's verifier and nonce;
// then a fresh session.
app.get('/callback', async (req, res) => {
  const { code_verifier, nonce, next } = req.session.login ?? {}
  if (!code_verifier) return res.status(400).send(page(`<h1>This login wasn't started here</h1>`))
  let tokens
  try {
    tokens = await client.authorizationCodeGrant(config, new URL(req.originalUrl, redirect_uri), {
      pkceCodeVerifier: code_verifier, expectedNonce: nonce, idTokenExpected: true,
    })
  } catch {
    return res.status(400).send(page(`<h1>This login wasn't started here</h1>`))
  }
  const me = await client.fetchUserInfo(config, tokens.access_token, tokens.claims().sub)
  req.session.regenerate(() => {
    req.session.user = { sub: me.sub, name: me.name }
    res.redirect(next)
  })
})

app.listen(PORT)
