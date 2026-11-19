#!/bin/sh
# Calls a running users API three ways, as Axum's README example has it, and prints each answer's status line,
# content type and body:
#   ./calls.sh http://localhost:3000        (Axum: the release build of axum/, which listens on 3000)
#   ./calls.sh http://127.0.0.1:8130        (Quillo: quillo run main.qwe --port 8130)
url=${1:?the API, as http://host:port}
call() {
  echo "## $1"; shift
  curl -s -i "$@" | tr -d '\r' | awk 'NR==1 || tolower($0) ~ /^content-type/ { print } /^$/ { body=1; next } body { print }'
  echo
}
call "GET /" "$url/"
call 'POST /users {"username": "ada"}' "$url/users" --json '{"username": "ada"}'
call 'POST /users {"user": "ada"}' "$url/users" --json '{"user": "ada"}'
