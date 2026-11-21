#!/bin/sh
# Uses every side's Trail Guide in Chromium: probe.mjs (clicks, calls, downloads, JavaScript off) and routes.mjs
# (eight addresses), from the release builds, started by servers.mjs (which stops only what it started).
# What each printed goes to runs/probe-<side>.txt and runs/routes-<side>.txt, the details to ../assets/*.json.
#   sh measure.sh
set -u
here=$(cd "$(dirname "$0")" && pwd); root=$(cd "$here/../../.." && pwd)
export PATH="$root/.cache/node26/bin:/usr/bin:/bin:/usr/sbin" NODE_PATH="$root/node_modules"
cd "$here"
log=$(mktemp)
node servers.mjs leptos leptos-async dioxus dioxus-tuned quillo quillo-title > "$log" 2>&1 & SP=$!
i=0; until grep -q '^quillo-title ' "$log" 2>/dev/null || [ $i -gt 600 ]; do sleep 0.25; i=$((i + 1)); done
for s in leptos:8210 leptos-async:8212 dioxus:8211 dioxus-tuned:8213 quillo:8200 quillo-title:8201; do
  side=${s%%:*}; url=http://127.0.0.1:${s#*:}
  node probe.mjs "$side" "$url" "../assets/probe-$side.json" > "runs/probe-$side.txt" 2>&1
  node routes.mjs "$side" "$url" "../assets/routes-$side.json" > "runs/routes-$side.txt" 2>&1
  echo "$side: $(grep -c " loads " "runs/probe-$side.txt") steps, $(grep -c '^  /' "runs/routes-$side.txt") addresses"
done
kill "$SP" 2>/dev/null; wait "$SP" 2>/dev/null
rm -f "$log"
