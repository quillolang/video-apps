// Trail Club: log in with the club's OpenID Connect provider, through openid-client: the first try, which works,
// and has three holes (no state or PKCE, any ?next= followed, the session kept across the login).
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

// To the provider. Where to go after logging in (?next=) is kept in the session.
app.get('/login', (req, res) => {
  req.session.next = req.query.next ?? '/'
  res.redirect(client.buildAuthorizationUrl(config, { redirect_uri, scope: 'openid profile' }).href)
})

// Back from the provider: the code for tokens, the user in the session, and on to ?next=.
app.get('/callback', async (req, res) => {
  const tokens = await client.authorizationCodeGrant(config, new URL(req.originalUrl, redirect_uri))
  const me = await client.fetchUserInfo(config, tokens.access_token, tokens.claims().sub)
  req.session.user = { sub: me.sub, name: me.name }
  res.redirect(req.session.next ?? '/')
})

app.listen(PORT)
