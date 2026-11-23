#!/bin/sh
# Checks and measures the eight builds, served as in MEASURE.md (serve.mjs on 5181-5187, quillo run on 8096).
set -eu
cd "$(dirname "$0")"
apps="react=http://127.0.0.1:5181 vue=http://127.0.0.1:5182 svelte=http://127.0.0.1:5183 solid=http://127.0.0.1:5184 dioxus=http://127.0.0.1:5185 quillo=http://127.0.0.1:8096 react-compiler=http://127.0.0.1:5186 dioxus-signal=http://127.0.0.1:5187"
node check.mjs $apps > runs/check.txt 2>&1
{ date '+%Y-%m-%d %H:%M'; uptime; echo "\$ node measure.mjs $apps"; JSON_FILE=runs/measure.json node measure.mjs $apps; } > runs/measure.txt 2>&1
