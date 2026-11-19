#!/bin/sh
# Calls a running trails API twice: as it is, then after the trails table is dropped while it runs, and prints
# each answer's status line, content type and body:
#   ./calls.sh http://127.0.0.1:3000 trails/trails.db       (Axum: ./target/release/trails, in trails/)
#   ./calls.sh http://127.0.0.1:8119 ../app/trails.db       (Quillo: quillo run main.qwe --port 8119)
url=${1:?the API, as http://host:port}; db=${2:?its trails.db}
call() {
  curl -s -i "$url/api/trails" | tr -d '\r' | awk 'NR==1 || tolower($0) ~ /^content-type/ { print } /^$/ { body=1; next } body { print }'
  echo
}
echo "## GET /api/trails"; call
sqlite3 "$db" 'drop table trails'
echo "## the table dropped, GET /api/trails again"; call
