#!/bin/sh
# Adds two loaves, restarts the server, and asks for the basket again (restart.mjs), for one of five setups:
#   ./restart.sh express-session | cookie-session | quillo | quillo-secret | quillo-table
cd "$(dirname "$0")"
case $1 in
  express-session) spec='{"name":"express-session","cmd":"node","args":["app.js"],"cwd":"express","port":8090,"env":{"SESSION_SECRET":"bakery-secret"}}' ;;
  cookie-session) spec='{"name":"cookie-session","cmd":"node","args":["variants/cookie.js"],"cwd":"express","port":8090,"env":{"SESSION_SECRET":"bakery-secret"}}' ;;
  quillo) spec='{"name":"Quillo","cmd":".quillo/bin/quillo","args":["run","main.qwe","--port","8080"],"cwd":"../app","port":8080,"env":{}}' ;;
  quillo-secret) spec='{"name":"Quillo, QUILLO_SECRET set","cmd":".quillo/bin/quillo","args":["run","main.qwe","--port","8080"],"cwd":"../app","port":8080,"env":{"QUILLO_SECRET":"a-long-random-string-for-the-bakery-0123456789"}}' ;;
  quillo-table) spec='{"name":"Quillo, a table","cmd":".quillo/bin/quillo","args":["run","main.qwe","--port","8080"],"cwd":"../steps/table","port":8080,"env":{"QUILLO_SECRET":"a-long-random-string-for-the-bakery-0123456789"}}' ;;
  *) echo "usage: ./restart.sh express-session | cookie-session | quillo | quillo-secret | quillo-table" >&2; exit 2 ;;
esac
node restart.mjs "$spec" 2>&1 >/dev/null
