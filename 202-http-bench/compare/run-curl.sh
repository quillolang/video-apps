#!/bin/sh
# Starts both servers (Quillo on 8095, the Dioxus build on 8096), saves what curl gets from each in runs/, and stops them.
#   sh compare/run-curl.sh
set -eu
here=$(cd "$(dirname "$0")" && pwd); root=$(cd "$here/../../.." && pwd)
if [ -f "$root/engine/build.mjs" ]; then dx=$root/.cache/rust-target/v202/dioxus; else dx=$here/.build/dioxus; fi
if [ -f "$here/../app/main.qwe" ]; then app=$here/../app; else app=$here/..; fi
node "$here/make-db.mjs"
cp "$app/fortunes.db" "$dx/"
(cd "$app" && exec ./.quillo/bin/quillo run main.qwe --port 8095 --log off) > /dev/null 2>&1 & q=$!
(cd "$dx" && IP=127.0.0.1 PORT=8096 exec ./server) > /dev/null 2>&1 & d=$!
trap 'kill $q $d' EXIT
sleep 2
run() { out=$1; shift; { printf '$ %s\n' "$*"; "$@"; echo; } > "$here/runs/$out"; }
run run-quillo-text.txt curl -s localhost:8095/text
run run-dioxus-text.txt curl -s localhost:8096/text
run run-quillo-json.txt curl -s localhost:8095/json
run run-dioxus-json.txt curl -s localhost:8096/json
run run-quillo-compute.txt curl -s localhost:8095/compute
run run-dioxus-compute.txt curl -s localhost:8096/compute
for p in fortunes db; do
  { printf '$ curl -s -o /dev/null -w "%%{size_download} bytes\\n" localhost:8095/%s\n' $p; curl -s -o /dev/null -w "%{size_download} bytes\n" localhost:8095/$p
    printf '$ curl -s -o /dev/null -w "%%{size_download} bytes\\n" localhost:8096/%s\n' $p; curl -s -o /dev/null -w "%{size_download} bytes\n" localhost:8096/$p
    printf '$ curl -s -o /dev/null -w "%%{size_download} bytes\\n" localhost:8096/axum/%s\n' $p; curl -s -o /dev/null -w "%{size_download} bytes\n" localhost:8096/axum/$p; } > "$here/runs/run-size-$p.txt"
done
{ for u in localhost:8095/fortunes localhost:8096/fortunes localhost:8096/axum/fortunes; do
    printf '$ curl -s %s | grep -o "<script" | wc -l\n' $u; curl -s $u | grep -o "<script" | wc -l | tr -d ' '
  done
  printf '$ curl -s localhost:8096/fortunes | grep -o "data-node-hydration" | wc -l\n'; curl -s localhost:8096/fortunes | grep -o "data-node-hydration" | wc -l | tr -d ' '; } > "$here/runs/run-scripts.txt"
curl -s localhost:8095/fortunes > "$here/runs/page-quillo-fortunes.html"
curl -s localhost:8096/fortunes > "$here/runs/page-dioxus-fortunes.html"
curl -s localhost:8096/axum/fortunes > "$here/runs/page-axum-fortunes.html"
