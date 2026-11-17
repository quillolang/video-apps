#!/bin/sh
# Tries every word in words.txt as Ada's password, and prints each answer's status: 401 wrong, 429 too many, 200 in.
#   ./guess.sh                  (or ./guess.sh localhost:8081 for another server)
n=0
for word in $(cat words.txt); do
  n=$((n + 1))
  code=$(curl -s -o /dev/null -w '%{http_code}' -d "name=ada&password=$word" "${1:-localhost:8080}/login")
  printf '%s ' "$code"
  if [ "$code" = 200 ]; then printf '\ntry %s: %s\n' "$n" "$word"; exit 0; fi
done
printf '\n%s words, and no way in\n' "$n"
