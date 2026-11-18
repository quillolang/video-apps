#!/bin/sh
# One loaf, then two more at the same moment with the same cookie, 20 times (race.mjs), for one of five setups:
#   ./race.sh express-session | cookie-session | quillo | quillo-secret | quillo-table
cd "$(dirname "$0")"
# The Quillo app is ../app in the video's own folder, and .. in github.com/quillolang/video-apps. Its quillo runs both
# Quillo versions (the app, and ../steps/table), and is fetched first when it isn't there yet.
app=../app; [ -d "$app" ] || app=..
q=$(cd "$app" && pwd)/.quillo/bin/quillo
[ -x "$q" ] || (cd "$app" && sh get-quillo.sh) >&2
secret=a-long-random-string-for-the-bakery-0123456789
case $1 in
  express-session) spec='{"name":"express-session","cmd":"node","args":["app.js"],"cwd":"express","port":8090,"env":{"SESSION_SECRET":"bakery-secret"}}' ;;
  cookie-session) spec='{"name":"cookie-session","cmd":"node","args":["variants/cookie.js"],"cwd":"express","port":8090,"env":{"SESSION_SECRET":"bakery-secret"}}' ;;
  quillo) spec='{"name":"Quillo","cmd":"'"$q"'","args":["run","main.qwe","--port","8080"],"cwd":"'"$app"'","port":8080,"env":{}}' ;;
  quillo-secret) spec='{"name":"Quillo, QUILLO_SECRET set","cmd":"'"$q"'","args":["run","main.qwe","--port","8080"],"cwd":"'"$app"'","port":8080,"env":{"QUILLO_SECRET":"'"$secret"'"}}' ;;
  quillo-table) spec='{"name":"Quillo, a table","cmd":"'"$q"'","args":["run","main.qwe","--port","8080"],"cwd":"../steps/table","port":8080,"env":{"QUILLO_SECRET":"'"$secret"'"}}' ;;
  *) echo "usage: ./race.sh express-session | cookie-session | quillo | quillo-secret | quillo-table" >&2; exit 2 ;;
esac
node race.mjs "$spec" 2>&1 >/dev/null
