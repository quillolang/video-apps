#!/bin/sh
# The visitor's cookie: a real one from SvelteKit (a random id), then a made-up one sent to SvelteKit and to Quillo.
# Prints each command and what it printed, as compare/logs/cookie.txt has them:  sh compare/cookie.sh
# Needs: npm run build in compare/sveltekit, and the Quillo app's .quillo/bin/quillo (sh get-quillo.sh).
set -e
here=$(cd "$(dirname "$0")" && pwd); video=$(dirname "$here")
W=$(mktemp -d); mkdir -p "$W/k" "$W/q"; cp "$video/app/main.qwe" "$video/app/style.qwe" "$W/q/"
# Both servers stop however the script ends.
trap 'kill "$(cat "$W/kpid" 2>/dev/null)" "$(cat "$W/qpid" 2>/dev/null)" 2>/dev/null; sleep 1; rm -rf "${W:?}"' EXIT
(cd "$W/k" && PORT=8306 HOST=127.0.0.1 ORIGIN=http://127.0.0.1:8306 STATE_DB="$W/k/state.db" node --no-warnings "$here/sveltekit/build/index.js" > /dev/null 2>&1 & echo $! > "$W/kpid")
(cd "$W/q" && QUILLO_SECRET=$(openssl rand -hex 32) "$video/app/.quillo/bin/quillo" run main.qwe --port 8307 > /dev/null 2>&1 & echo $! > "$W/qpid")
for i in $(seq 1 100); do curl -s -o /dev/null 127.0.0.1:8306/ && curl -s -o /dev/null 127.0.0.1:8307/ && break; sleep 0.1; done
# The visitor form's address, as the page gives it (a form with JavaScript off posts there).
A=$(curl -s 127.0.0.1:8306/ | grep -o 'action="[^"]*addVisitorOne"' | sed 's/action="//; s/"$//')
run() { echo "\$ $1"; sh -c "$1"; }
run "curl -si -d '' -H 'Accept: text/html' -H 'Origin: http://127.0.0.1:8306' '127.0.0.1:8306/$A' | grep -io 'set-cookie: visitor=[^;]*'"
run "curl -s -H 'Cookie: visitor=999' 127.0.0.1:8306/ | grep -o 'This visitor: [0-9]*'"
run "curl -s -H 'Cookie: __Host-quillo_session=n=999' 127.0.0.1:8307/ | grep -o 'This visitor: [0-9]*'"
