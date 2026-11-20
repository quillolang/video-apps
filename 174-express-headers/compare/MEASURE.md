# Security headers, Express (and helmet) vs Quillo: the measurements

Every result in the video comes from the runs below, copied from the run. `headers.mjs` reads a side's headers, frames
its page from another site, and clicks its like button, in a real browser; its tables are `headers-<side>.txt`, and
the headers, the frame's result and the console's messages are in `../assets/headers-<side>.json`. Measured on one
machine.

- **When:** Fri Nov 20 2026, about 01:30 +08 (the install, `install.txt`, and the runs)
- **Machine:** Apple M5, arm64; macOS 26.7.1
- **Node:** v24.11.0; **Express** 5.3.0, **helmet** 8.3.0 (`npm install express helmet`: 66 packages)
- **Quillo:** `quillo 0.8.6 (238dac2, 2026-11-16)` (each folder's own, from its get-quillo.sh)
- **Browser:** Chromium (Playwright's), headless

## The pages

Trail Club's home page: a heading, the trails, and a like button that counts on the server.

- **Express** (`express/`, `npm init -y`, `npm install express helmet`): `app.js` writes the page in one route, with an
  inline `<script>` that posts each click to `POST /like` and shows the new count. `variants/helmet.js` is the same
  with `app.use(helmet())` (its defaults); `variants/helmet-file.js` is that with the script moved to `public/like.js`
  (`express.static('public')`, `<script src="/like.js">`). Run with `node <file>` (3000).
- **Quillo**: `../steps/v1/main.qwe`, a top-level `likes`, `server fn total()` and `server fn like()`, and a `Like`
  component (`state n = total()`, `onclick={() => { n = like() }}`); `../app/main.qwe` is that with the guide's own
  line, `site_headers({ "content-security-policy": "default-src 'self'", "referrer-policy": "same-origin" })`.
  `quillo check`: `main.qwe: ok (1 route, 2 functions, 1 component)` for both. Run on 8170.

## The runs (headers.mjs)

"Security headers" counts these when sent: content-security-policy, strict-transport-security, x-frame-options,
x-content-type-options, referrer-policy, cross-origin-opener-policy, cross-origin-resource-policy,
origin-agent-cluster, x-dns-prefetch-control, x-download-options, x-permitted-cross-domain-policies, x-xss-protection
and permissions-policy. "Says who it is" is x-powered-by and server. The other site is a page at `127.0.0.1:9000`
(another site to the browser: the club is at `localhost`) with the club's page in an iframe; "framed" means the
frame's `h1` is the club's. The button is clicked twice, 0.6 s apart.

```
$ node headers.mjs express out.json
express
  security headers  0: none
  says who it is    x-powered-by: Express
  framed by another site  yes, the page shows in the frame
  the like button   ♥ 0 -> ♥ 2
$ node headers.mjs quillo-v1 out.json
quillo-v1
  security headers  2: x-frame-options, x-content-type-options
  says who it is    server: Quillo
  framed by another site  refused
  the like button   ♥ 0 -> ♥ 2
$ node headers.mjs helmet out.json
helmet
  security headers  12: content-security-policy, strict-transport-security, x-frame-options, x-content-type-options, referrer-policy, cross-origin-opener-policy, cross-origin-resource-policy, origin-agent-cluster, x-dns-prefetch-control, x-download-options, x-permitted-cross-domain-policies, x-xss-protection
  says who it is    nothing
  framed by another site  refused
  the like button   ♥ 0 -> ♥ 0 (nothing happened); the console: "Executing inline script violates the following Content Security Policy directive 'script-s..."
$ node headers.mjs helmet-file out.json
helmet-file
  security headers  12: content-security-policy, strict-transport-security, x-frame-options, x-content-type-options, referrer-policy, cross-origin-opener-policy, cross-origin-resource-policy, origin-agent-cluster, x-dns-prefetch-control, x-download-options, x-permitted-cross-domain-policies, x-xss-protection
  says who it is    nothing
  framed by another site  refused
  the like button   ♥ 0 -> ♥ 2
$ node headers.mjs quillo out.json
quillo
  security headers  4: content-security-policy, x-frame-options, x-content-type-options, referrer-policy
  says who it is    server: Quillo
  framed by another site  refused
  the like button   ♥ 0 -> ♥ 2
```

The headers each sent, by name:

```
express
  x-powered-by: Express

quillo-v1
  server: Quillo
  x-content-type-options: nosniff
  x-frame-options: SAMEORIGIN

helmet
  content-security-policy: default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests
  cross-origin-opener-policy: same-origin
  cross-origin-resource-policy: same-origin
  origin-agent-cluster: ?1
  referrer-policy: no-referrer
  strict-transport-security: max-age=31536000; includeSubDomains
  x-content-type-options: nosniff
  x-dns-prefetch-control: off
  x-download-options: noopen
  x-frame-options: SAMEORIGIN
  x-permitted-cross-domain-policies: none
  x-xss-protection: 0

helmet-file
  content-security-policy: default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests
  cross-origin-opener-policy: same-origin
  cross-origin-resource-policy: same-origin
  origin-agent-cluster: ?1
  referrer-policy: no-referrer
  strict-transport-security: max-age=31536000; includeSubDomains
  x-content-type-options: nosniff
  x-dns-prefetch-control: off
  x-download-options: noopen
  x-frame-options: SAMEORIGIN
  x-permitted-cross-domain-policies: none
  x-xss-protection: 0

quillo
  content-security-policy: default-src 'self'; script-src 'self' 'sha256-PQX5S1UenMiU5dMkqxPGh97fF1CqZrn8mGwrartj/dM=' 'sha256-0pSLbwB1L5fZzuxNTrrKX+aGg+w7kBJh8v2Q5eV41F4='; style-src 'self' 'sha256-1eSi0RYDijUJJxOeQDg0puYJPTOK8wBOXlN78105sfc='
  referrer-policy: same-origin
  server: Quillo
  x-content-type-options: nosniff
  x-frame-options: SAMEORIGIN
```

helmet's `script-src 'self'` refused the page's inline script (the console's message is in
`../assets/headers-helmet.json`), so the button did nothing; moved to a file, it ran. Quillo's `default-src 'self'`
was sent with a `script-src` naming each script Quillo wrote into the page by its hash (and a `style-src` hash for
its islands' style), as the guide says (since 0.8.6), so the component ran.

## Quillo's server header

`site_headers({ "server": null })` does not take away `server: Quillo` (on 0.8.6 and 0.8.8, while
`"x-frame-options": null` does take its header away); a route's own `respond(200, "hi", { "server": null })` does.
Reported as Q-1256 in the Quillo repository's feedback (FEEDBACK79).

## The screenshots (../shots.mjs)

`frame_express` and `frame_quillo` (the other site's page with the club's in its frame: Express's shows, Quillo's
frame stays empty), `button_helmet` and `button_quillo` (each page after two clicks: helmet's defaults, Quillo with
site_headers).

## Not measured

No speed numbers: other work was running on the machine (everything here ran at background priority).
