# The one-word fix that ships your secret: what was run

`run-compare.sh` builds the Vite and Next.js versions (each from a temp copy, installed from its lockfile) and keeps each
command and what it printed in `runs/`. `../shots.mjs` takes the screenshots and runs the Quillo side (`../assets/runs.json`).
`../make-video.py` checks the narration against both. Payly and its keys are made up.

- **When:** 2026-11-21 14:23 +08
- **Machine:** Apple M5, 16 GB; macOS 26.7.1
- **Node:** 26.13.1 (LTS), from nodejs.org, with its npm 11.20.0
- **Vite:** create-vite 9.3.4, the React template; vite 8.3.8, react 19.3.1
- **Next.js:** create-next-app 16.4.6 (JavaScript, App Router, no Tailwind/ESLint), next 16.4.6; NEXT_TELEMETRY_DISABLED=1
- **Quillo:** `quillo 0.8.8 (f35bf2d, 2026-11-19)`

## Vite (`vite/versions`: App.v1.jsx with PAYLY_SECRET, App.v2.jsx with VITE_PAYLY_SECRET)

```
$ node --version && npm --version && npx vite --version
v26.13.1
11.20.0
vite/8.3.8 darwin-arm64 node-v26.13.1

$ cat .env
PAYLY_SECRET=payly_secret_demo_9c71

$ npm run build --silent | tail -4
dist/assets/index-Bk7lim_S.css    0.03 kB │ gzip:  0.05 kB
dist/assets/index-DEmkuS8q.js   219.91 kB │ gzip: 68.81 kB

✓ built in 355ms

$ grep -o 'Bearer [a-z0-9_]*' dist/assets/*.js
Bearer undefined

$ cat .env
VITE_PAYLY_SECRET=payly_secret_demo_9c71

$ npm run build --silent | tail -4
dist/assets/index-Bk7lim_S.css    0.03 kB │ gzip:  0.05 kB
dist/assets/index-CsaJGzjR.js   219.92 kB │ gzip: 68.83 kB

✓ built in 193ms

$ grep -o 'Bearer [a-z0-9_]*' dist/assets/*.js
Bearer payly_secret_demo_9c71

$ npx vite build --config vite.everything.config.js 2>&1 | head -2
error during build:
Error: envPrefix option contains value '', which could lead unexpected exposure of sensitive information.

```

In the browser (vite preview): v1 shows `Payly secret: undefined`, v2 `Payly secret: loaded ✓`.

## Next.js (`next/versions`: pay.v1.js, pay.v2.js with NEXT_PUBLIC_, pay.v3.js + actions.v3.js, a Server Action)

```
$ npx next --version
Next.js v16.4.6

$ cat .env
PAYLY_SECRET=payly_secret_demo_9c71

$ npm run build --silent | tail -7
Route (app)
┌ ○ /
└ ○ /_not-found


○  (Static)  prerendered as static content

$ grep -rl payly_secret .next/static || echo 'no match'
no match

$ cat .env
NEXT_PUBLIC_PAYLY_SECRET=payly_secret_demo_9c71

$ npm run build --silent | tail -7
Route (app)
┌ ○ /
└ ○ /_not-found


○  (Static)  prerendered as static content

$ grep -rho 'Bearer payly_[a-z0-9_]*' .next/static
Bearer payly_secret_demo_9c71

$ cat .env
PAYLY_SECRET=payly_secret_demo_9c71
NEXT_PUBLIC_PAYLY_KEY=payly_pub_demo_4f2a

$ npm run build --silent | tail -7
Route (app)
┌ ○ /
└ ○ /_not-found


○  (Static)  prerendered as static content

$ grep -rl payly_secret .next/static || echo 'no match'
no match

$ grep -rho 'payly_pub_[a-z0-9_]*' .next/static | sort -u
payly_pub_demo_4f2a

```

v1 in `next dev`: the page shows `Payly secret: undefined` after hydration; the server's HTML had `Payly secret: <!-- -->loaded ✓<` (`curl -s localhost:3196/ | grep -o 'Payly secret: [^/]*'`),
and the dev overlay reports a recoverable error, "Hydration failed because the server rendered text didn't match the client".
In production (`next start`), v1 shows the same, with React's minified error #418 in the console. v2: `Payly secret: loaded ✓`. v3: `Payly key: payly_pub_demo_4f2a`.

## Quillo

```
$ quillo check   # steps/v1
main.qwe:3: error: `env` is not available in the browser, where <Pay> also runs; use a `server fn` (or name the variable PUBLIC_..., which says the browser may see it)
quillo: 1 error
$ quillo check   # steps/v2
main.qwe: ok (1 route, 0 functions, 1 component)
$ quillo check   # app
main.qwe: ok (1 route, 1 function, 1 component)
```

steps/v2 running (`quillo run main.qwe --port 8130`):

```
$ curl -s localhost:8130/ | grep -o '/_quillo/[^"]*[.]js'
/_quillo/r/584985cd4856d6b3.js
/_quillo/b/d64460fc96c04b60.js
$ curl -s localhost:8130/_quillo/r/584985cd4856d6b3.js | grep -o 'payly_secret_[a-z0-9_]*'
$ curl -s localhost:8130/_quillo/b/d64460fc96c04b60.js | grep -o 'payly_secret_[a-z0-9_]*'
payly_secret_demo_9c71
```

app/ running:

```
$ curl -s localhost:8130/ | grep -o '/_quillo/[^"]*[.]js'
/_quillo/r/69a07053b9212cde.js
/_quillo/b/0fc3e1120a5ef446.js
$ curl -s localhost:8130/_quillo/r/69a07053b9212cde.js | grep -c payly_secret
0
$ curl -s localhost:8130/_quillo/b/0fc3e1120a5ef446.js | grep -c payly_secret
0
$ curl -s localhost:8130/_quillo/r/69a07053b9212cde.js | grep -o 'payly_pub_[a-z0-9_]*'
$ curl -s localhost:8130/_quillo/b/0fc3e1120a5ef446.js | grep -o 'payly_pub_[a-z0-9_]*'
payly_pub_demo_4f2a
```
