#!/bin/sh
# Loads a page of the running app: how long it takes (the middle of five
# loads), and the queries one load runs, from Quillo's query stats (on under
# quillo run --watch, where this machine may read them).   ./stats.sh /orders
q=localhost:8080/_quillo/health/queries
page=localhost:8080$1
curl -s -o /dev/null "$page"                                # once, to warm up
for i in 1 2 3 4 5; do curl -s -o /dev/null -w '%{time_total}\n' "$page"; done |
  sort -n | sed -n 3p | awk -v p="$1" '{ printf "%s: %.1f ms\n", p, $1 * 1000 }'
curl -s -o /dev/null -X POST "$q?on=1"                      # forget what ran so far
curl -s -o /dev/null "$page"                                # once more, counted
curl -s "$q" | jq -r '.statements[] | "\(.total) × \(.sql)"'
