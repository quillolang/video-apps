#!/bin/sh
# The HTTP status each address answers, as curl (and a search engine's crawler) gets it:
#   ./status.sh http://localhost:4173
for p in /trails/2 /trails/abc /trails/999 /trails/02 /nope; do
  echo "$(curl -s -o /dev/null -w '%{http_code}' "$1$p")  $p"
done
