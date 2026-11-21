#!/bin/sh
# The video's terminal scenes, run for real: the trail club's photo upload in Express 5.3.0 with multer 2.5.0 (express/:
# versions/server.v1.js as multer's README starts, no limits; server.v2.js with limits.fileSize and a 413), and in
# Quillo 0.8.8 (../app). Files of zeros stand in for photos. Node 26.13.1 (.cache/node26). Everything runs in a temp
# folder, on this machine; each server started here is stopped by its own process.
#   sh videos/199-upload-limits/compare/run-compare.sh
set -u
here=$(cd "$(dirname "$0")" && pwd); root=$(cd "$here/../../.." && pwd); video=$(cd "$here/.." && pwd)
work=$(mktemp -d "${TMPDIR:-/tmp}/trail-photos.XXXXXX")
runs=$here/runs; rm -rf "$runs"; mkdir -p "$runs"
mkdir -p "$work/bin"; ln -s "$video/app/.quillo/bin/quillo" "$work/bin/quillo"
export PATH="$root/.cache/node26/bin:$work/bin:/usr/bin:/bin:/usr/sbin" npm_config_cache="$work/npm-cache" npm_config_update_notifier=false \
  npm_config_fund=false TERM=dumb NO_COLOR=1
run() { name=$1; dir=$2; shift 2; { printf '$ %s\n' "$*"; (cd "$dir" && sh -c "$*" 2>&1); } > "$runs/$name.txt"; }
PID=
serve() {
  dir=$1; port=$2; shift 2
  (cd "$dir" && exec "$@" > "$work/server.log" 2>&1) & PID=$!
  i=0; until lsof -nP -iTCP:"$port" -sTCP:LISTEN >/dev/null 2>&1 || [ $i -gt 120 ]; do sleep 0.25; i=$((i + 1)); done; sleep 1
}
stop() { kill "$PID" 2>/dev/null; wait "$PID" 2>/dev/null; sleep 1; }

E=$work/trail-photos; mkdir -p "$E"; (cd "$here/express" && tar cf - --exclude node_modules --exclude uploads .) | (cd "$E" && tar xf -)
(cd "$E" && npm ci --silent)
Q=$work/trail-photos-quillo; mkdir -p "$Q"; cp "$video/app/main.qwe" "$Q/"
P=$work/photos; mkdir -p "$P"

run 01-versions "$E" "node --version && npm ls express multer | grep -E 'express@|multer@'"
run 02-files "$P" "head -c 209715200 /dev/zero > big.jpg && head -c 3000000 /dev/zero > medium.jpg && head -c 500000 /dev/zero > photo.jpg && ls -lh *.jpg | awk '{ print \$5, \$9 }'"

# Express, as multer's README starts: no limits.
cp "$E/versions/server.v1.js" "$E/server.js"
serve "$E" 3000 node server.js
run 03-express-big "$P" "curl -s -F photo=@big.jpg localhost:3000/photos; echo"
run 04-express-five "$P" "for i in 1 2 3 4; do curl -s -F photo=@big.jpg localhost:3000/photos; echo; done"
run 05-express-du "$E" "du -sh uploads | awk '{ print \$1, \$2 }'"
node -e "console.log(JSON.stringify({ text: 'a'.repeat(200000) }))" > "$P/note.json"
run 06-express-json "$P" "ls -lh note.json | awk '{ print \$5, \$9 }' && curl -s -o /dev/null -w '%{http_code}\\n' -H 'content-type: application/json' --data-binary @note.json localhost:3000/notes"
stop

# Express with limits.fileSize, and its error made a 413.
rm -rf "$E/uploads"; cp "$E/versions/server.v2.js" "$E/server.js"
serve "$E" 3000 node server.js
run 07-express2-big "$P" "curl -s -w ' (%{http_code})\\n' -F photo=@big.jpg localhost:3000/photos"
run 08-express2-medium "$P" "curl -s -w ' (%{http_code})\\n' -F photo=@medium.jpg localhost:3000/photos"
run 09-express2-photo "$P" "curl -s -w ' (%{http_code})\\n' -F photo=@photo.jpg localhost:3000/photos"
run 10-express2-ls "$E" "ls uploads | wc -l | tr -d ' '"
stop

# Quillo, as it comes.
serve "$Q" 8080 quillo run main.qwe
run 11-quillo-big "$P" "curl -s -w ' (%{http_code})\\n' -F photo=@big.jpg localhost:8080/photos"
run 12-quillo-medium "$P" "curl -s -w ' (%{http_code})\\n' -F photo=@medium.jpg localhost:8080/photos"
run 13-quillo-photo "$P" "curl -s -w ' (%{http_code})\\n' -F photo=@photo.jpg localhost:8080/photos"
run 14-quillo-ls "$Q" "ls uploads | wc -l | tr -d ' '"
stop
grep -v '^\s*$' "$work/server.log" | head -8 > "$runs/15-quillo-log.txt"

date '+%Y-%m-%d %H:%M %Z' > "$runs/00-date.txt"
rm -rf "$work"
ls "$runs"
