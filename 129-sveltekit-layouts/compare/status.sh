#!/bin/sh
# The HTTP status of each address, as curl gets it (a crawler or a link checker sees the same):
#   ./status.sh http://localhost:4182
for p in /trails/3 /trails/999 /trails/abc /trails/nope /nope; do
	printf '%-13s %s\n' "$p" "$(curl -s -o /dev/null -w '%{http_code}' "$1$p")"
done
