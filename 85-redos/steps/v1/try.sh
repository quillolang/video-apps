#!/bin/sh
# One long "email" and, a moment later, a visitor who only wants the home page.
#   ./try.sh 8081 32      the port, and how many letters before the "!"
port=${1:-8080}
long="$(head -c "${2:-32}" < /dev/zero | tr '\0' a)!"
t=$(mktemp -d)
took() { awk '{ if ($1 < 1) printf "%.1f ms", $1 * 1000; else printf "%.1f s", $1 }'; }
curl -s -w '\n%{time_total}\n' -d "email=$long" "localhost:$port/join" > "$t/long" &
sleep 0.2
curl -s -o /dev/null -w '%{time_total}\n' "localhost:$port/" > "$t/visitor"
wait
echo "long email: $(head -1 "$t/long") ($(tail -1 "$t/long" | took))"
echo "a visitor:  home page in $(took < "$t/visitor")"
rm -rf "$t"
