// One of the club's sites (Trail Club, Photo Album): log in with the club's OpenID Connect provider, through openid-client.
import express from 'express'
import session from 'express-session'
import * as client from 'openid-client'
import { readFileSync } from 'node:fs'

const PORT = Number(process.env.PORT ?? 3000)
const SITE = process.env.SITE ?? 'Trail Club'
const redirect_uri = `${process.env.BASE ?? `http://localhost:${PORT}`}/callback`
const css = readFileSync(new URL('./club.css', import.meta.url), 'utf8')
const config = await client.discovery(new URL(process.env.ISSUER ?? 'http://localhost:4000'), process.env.CLIENT_ID,
  process.env.CLIENT_SECRET, undefined, { execute: [client.allowInsecureRequests] }) // plain http, on this machine

const app = express()
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }))
const escape = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`)
const page = (body) => `<!doctype html><title>${SITE}</title><style>${css}</style><main>${body}</main>`

app.get('/', (req, res) => {
  const user = req.session.user
  res.send(page(user
    ? `<h1>${SITE}: hello, ${escape(user.name)}</h1><p class="who">Signed in as ${escape(user.sub)}.</p>`
    : `<h1>${SITE}</h1><p><a href="/login">Log in</a></p>`))
})

// To the provider, with a PKCE verifier and a nonce kept in the session.
app.get('/login', async (req, res) => {
  const code_verifier = client.randomPKCECodeVerifier()
  const code_challenge = await client.calculatePKCECodeChallenge(code_verifier)
  const nonce = client.randomNonce()
  req.session.login = { code_verifier, nonce }
  const url = client.buildAuthorizationUrl(config, {
    redirect_uri, scope: 'openid profile', code_challenge, code_challenge_method: 'S256', nonce,
  })
  res.redirect(url.href)
})

// Back from the provider: the code for tokens (the ID token checked), then the user.
app.get('/callback', async (req, res) => {
  const { code_verifier, nonce } = req.session.login ?? {}
  const tokens = await client.authorizationCodeGrant(config, new URL(req.originalUrl, redirect_uri), {
    pkceCodeVerifier: code_verifier, expectedNonce: nonce, idTokenExpected: true,
  })
  const me = await client.fetchUserInfo(config, tokens.access_token, tokens.claims().sub)
  req.session.regenerate(() => {
    req.session.user = { sub: me.sub, name: me.name }
    res.redirect('/')
  })
})

app.listen(PORT)
