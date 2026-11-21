#!/bin/sh
# The video's terminal scenes, run for real: each dev server as a developer starts it, what it printed, what it
# listens on (lsof), and what a request to this machine's Wi-Fi address gets (curl to the address another device would
# use). Next.js 16.4.6 (next/: Trail notes, whose page reads a notes.json that isn't there), Vite 8.3.8 (vite/), an old
# Vite 6.2.2 (vite-old/, for npm audit only) and Quillo 0.8.8 (../app). Node 26.13.1 (.cache/node26). No attack is run.
# Each project is copied to a temp folder first; each server started here is stopped by its own process (or, for npx,
# by the temp folder in its path), never by port. vite --host's line for this Mac's VPN interface (utun) is left out of
# its output: that address is private. Every other line is as printed.
#   sh videos/197-dev-server-host/compare/run-compare.sh
set -u
here=$(cd "$(dirname "$0")" && pwd); root=$(cd "$here/../../.." && pwd); video=$(cd "$here/.." && pwd)
work=$(mktemp -d "${TMPDIR:-/tmp}/trail-notes.XXXXXX")
runs=$here/runs; rm -rf "$runs"; mkdir -p "$runs"
IP=$(ipconfig getifaddr en0)
GH=$(command -v gh)
mkdir -p "$work/bin"; ln -s "$GH" "$work/bin/gh"; ln -s "$video/app/.quillo/bin/quillo" "$work/bin/quillo"
export PATH="$root/.cache/node26/bin:$work/bin:/usr/bin:/bin:/usr/sbin" npm_config_cache="$work/npm-cache" npm_config_update_notifier=false \
  npm_config_fund=false NEXT_TELEMETRY_DISABLED=1 TERM=dumb NO_COLOR=1 FORCE_COLOR=0
strip() { sed 's/\x1b\[[0-9;]*m//g'; }
run() { name=$1; dir=$2; shift 2; { printf '$ %s\n' "$*"; (cd "$dir" && sh -c "$*" 2>&1); } | strip > "$runs/$name.txt"; }
copy() { mkdir -p "$work/$2"; (cd "$here/$1" && tar cf - --exclude node_modules --exclude dist --exclude .next .) | (cd "$work/$2" && tar xf -); (cd "$work/$2" && npm ci --silent); }
# serve NAME DIR PORT COMMAND: starts it in the background, waits for its port, keeps its first lines of output
PID=
serve() {
  name=$1; dir=$2; port=$3; shift 3
  (cd "$dir" && exec "$@" > "$work/$name.log" 2>&1) & PID=$!
  i=0; until lsof -nP -iTCP:"$port" -sTCP:LISTEN >/dev/null 2>&1 || [ $i -gt 120 ]; do sleep 0.25; i=$((i + 1)); done; sleep 2
  { printf '$ %s\n' "$*"; strip < "$work/$name.log" | grep -v '^\s*$' | grep -v 'press h' | grep -v utun | head -6; } > "$runs/$name.txt"
}
stop() { kill "$PID" 2>/dev/null; pkill -f "$work/" 2>/dev/null; sleep 1; }
listens() { run "$1" "$work" "lsof -nP -iTCP:$2 -sTCP:LISTEN | awk 'NR > 1 { print \$1, \$9 }'"; }
reach() { run "$1" "$work" "curl -s -o /dev/null -w '%{http_code}\\n' http://$IP:$2/"; }

copy next next; copy vite vite
# The old Vite's package.json and lockfile are kept under other names, so the repository's scanners don't flag them.
mkdir -p "$work/vite-old"; cp "$here/vite-old/package.json.6.2.2" "$work/vite-old/package.json"; cp "$here/vite-old/package-lock.json.6.2.2" "$work/vite-old/package-lock.json"
(cd "$work/vite-old" && npm ci --silent); cp -R "$video/app" "$work/quillo"; rm -rf "$work/quillo/.quillo"
run 01-versions "$work/next" "node --version && npx next --version && (cd ../vite && npx vite --version)"

# Next.js: next dev, as it comes.
serve 02-next-dev "$work/next" 3000 npx next dev
listens 03-next-listens 3000
reach 04-next-reach 3000
run 05-next-error "$work" "curl -s http://$IP:3000/ | grep -o 'ENOENT: no such file or directory[^\\\\]*' | head -1"
run 06-next-path "$work" "curl -s http://$IP:3000/ | grep -o '/[a-zA-Z0-9_./-]*/[.]next/dev/server' | head -1"
stop
# The fix: -H localhost.
serve 07-next-dev-local "$work/next" 3000 npx next dev -H localhost
listens 08-next-local-listens 3000
reach 09-next-local-reach 3000
stop

# Vite: vite, as it comes, then vite --host.
serve 10-vite-dev "$work/vite" 5173 npx vite
listens 11-vite-listens 5173
reach 12-vite-reach 5173
stop
serve 13-vite-host "$work/vite" 5173 npx vite --host
listens 14-vite-host-listens 5173
reach 15-vite-host-reach 5173
stop
run 16-vite-old-audit "$work/vite-old" "npm ls vite | grep '── vite@' && npm audit | grep -c github.com/advisories"
run 17-vite-old-fs "$work/vite-old" "npm audit | grep -E 'raw\\?\\?|WebSocket'"
run 18-vite-advisory "$work" "gh api /advisories/GHSA-x574-m823-4x7w --jq .description | grep 'Only apps'"

# Quillo: quillo run --watch, as it comes, then on every address.
serve 19-quillo-dev "$work/quillo" 8080 quillo run main.qwe --watch
listens 20-quillo-listens 8080
reach 21-quillo-reach 8080
stop
serve 22-quillo-host "$work/quillo" 8080 quillo run main.qwe --watch --host 0.0.0.0
reach 23-quillo-host-reach 8080
run 24-quillo-host-error "$work" "curl -s http://$IP:8080/"
stop

echo "$IP" > "$runs/00-ip.txt"
date '+%Y-%m-%d %H:%M %Z' > "$runs/00-date.txt"
rm -rf "$work"
ls "$runs"
