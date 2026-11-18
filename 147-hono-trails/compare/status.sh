#!/bin/sh
# What each address answers, as curl (and a search engine's crawler) gets it: the HTTP status and the page's heading,
# or the error's first line.
#   ./status.sh http://localhost:8090
for p in /trails/2 /trails/02 /trails/0x2 /trails/abc /trails/999 /nope; do
  page=$(curl -s -w '\n%{http_code}' "$1$p")
  h1=$(echo "$page" | grep -o '<h1[^>]*>[^<]*\|<pre>[A-Za-z]*Error[^:<]*' | head -1 | sed 's/<[^>]*>//')
  printf '%s  %-12s %s\n' "$(echo "$page" | tail -1)" "$p" "$h1"
done
