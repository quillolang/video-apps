# Your dev server is on the Wi-Fi: what was run

`run-compare.sh` keeps each command and what it printed in `runs/`: each dev server as it starts (its first lines), what lsof
says it listens on, and what curl gets from this machine's Wi-Fi address (the address another device would use). Each project ran
from a temp copy. vite --host's line for this Mac's VPN interface (utun) is left out of its output, as that address is private.
No attack was run. `../shots.mjs` takes the screenshots; `../make-video.py` checks the narration against the runs.

- **When:** 2026-11-21 15:18 +08
- **Machine:** Apple M5, 16 GB; macOS 26.7.1
- **Wi-Fi address:** 192.168.1.48
- **Node:** 26.13.1 (LTS), from nodejs.org, with its npm 11.20.0
- **Quillo:** 0.8.8 (f35bf2d)

```
$ node --version && npx next --version && (cd ../vite && npx vite --version)
v26.13.1
Next.js v16.4.6
vite/8.3.8 darwin-arm64 node-v26.13.1

$ npx next dev
▲ Next.js 16.4.6 (Turbopack)
- Local:         http://localhost:3000
- Network:       http://192.168.1.48:3000
✓ Ready in 1081ms
✓ Running next.config.mjs took 73ms

$ lsof -nP -iTCP:3000 -sTCP:LISTEN | awk 'NR > 1 { print $1, $9 }'
node *:3000

$ curl -s -o /dev/null -w '%{http_code}\n' http://192.168.1.48:3000/
500

$ curl -s http://192.168.1.48:3000/ | grep -o 'ENOENT: no such file or directory[^\\]*' | head -1
ENOENT: no such file or directory, open 'notes.json'

$ curl -s http://192.168.1.48:3000/ | grep -o '/[a-zA-Z0-9_./-]*/[.]next/dev/server' | head -1
/private/var/folders/sn/97ygtwxj5cd6f9p3lq42mdc00000gn/T/trail-notes.uzX7Jj/next/.next/dev/server

$ npx next dev -H localhost
▲ Next.js 16.4.6 (Turbopack)
- Local:         http://localhost:3000
- Network:       http://localhost:3000
✓ Ready in 1128ms
✓ Running next.config.mjs took 21ms
- Cache Components enabled

$ lsof -nP -iTCP:3000 -sTCP:LISTEN | awk 'NR > 1 { print $1, $9 }'
node [::1]:3000

$ curl -s -o /dev/null -w '%{http_code}\n' http://192.168.1.48:3000/
000

$ npx vite
  VITE v8.3.8  ready in 443 ms
  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose

$ lsof -nP -iTCP:5173 -sTCP:LISTEN | awk 'NR > 1 { print $1, $9 }'
node [::1]:5173

$ curl -s -o /dev/null -w '%{http_code}\n' http://192.168.1.48:5173/
000

$ npx vite --host
  VITE v8.3.8  ready in 449 ms
  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.1.48:5173/   en0

$ lsof -nP -iTCP:5173 -sTCP:LISTEN | awk 'NR > 1 { print $1, $9 }'
node *:5173

$ curl -s -o /dev/null -w '%{http_code}\n' http://192.168.1.48:5173/
200

$ npm ls vite | grep '── vite@' && npm audit | grep -c github.com/advisories
└── vite@6.2.2
17

$ npm audit | grep -E 'raw\?\?|WebSocket'
Vite bypasses server.fs.deny when using ?raw?? - https://github.com/advisories/GHSA-x574-m823-4x7w
Vite Vulnerable to Arbitrary File Read via Vite Dev Server WebSocket - https://github.com/advisories/GHSA-p9ff-h696-f583

$ gh api /advisories/GHSA-x574-m823-4x7w --jq .description | grep 'Only apps'
Only apps explicitly exposing the Vite dev server to the network (using `--host` or [`server.host` config option](https://vitejs.dev/config/server-options.html#server-host)) are affected.

$ quillo run main.qwe --watch
quillo: sessions are signed with .quillo/.quillo-secret (development only; set QUILLO_SECRET in production)
quillo: 1 route listening on http://127.0.0.1:8080
quillo: watching for changes

$ lsof -nP -iTCP:8080 -sTCP:LISTEN | awk 'NR > 1 { print $1, $9 }'
quillo 127.0.0.1:8080

$ curl -s -o /dev/null -w '%{http_code}\n' http://192.168.1.48:8080/
000

$ quillo run main.qwe --watch --host 0.0.0.0
quillo: sessions are signed with .quillo/.quillo-secret (development only; set QUILLO_SECRET in production)
quillo: 1 route listening on http://0.0.0.0:8080
quillo: watching for changes
quillo: warning: --watch listens on 0.0.0.0, not this machine alone: anyone on its network can reach the program's routes and server fns, and sees its errors in full. Leave out --host to keep it to this machine

$ curl -s -o /dev/null -w '%{http_code}\n' http://192.168.1.48:8080/
500

$ curl -s http://192.168.1.48:8080/
{"error":"read_file: notes.json: No such file or directory (os error 2)"}

```
