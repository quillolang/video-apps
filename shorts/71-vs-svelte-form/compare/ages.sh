#!/bin/sh
# Posts the sign-up form to a running app with seven ages, as a browser does with JavaScript off: with its Origin
# header, which SvelteKit checks, and Accept: text/html (with curl's */*, SvelteKit answers JSON, as for use:enhance).
# Prints each answer's status and its message, found in the HTML without the comments Svelte puts in it:
#   ./ages.sh http://localhost:5177        (SvelteKit: npm run dev -- --port 5177)
#   ./ages.sh http://127.0.0.1:8115        (Quillo: quillo run --port 8115)
url=${1:?the app, as http://host:port}
for age in 14 12 abc 0x0E 1e1 02 ""; do
  out=$(curl -s -w '\n%{http_code}' -H "Origin: $url" -H 'Accept: text/html' \
    --data-urlencode "email=ada@example.com" --data-urlencode "age=$age" "$url/")
  code=$(printf '%s\n' "$out" | tail -n 1)
  says=$(printf '%s\n' "$out" | sed '$d' | sed 's/<!--[^>]*-->//g' | grep -o 'Welcome, [^<!]*!\|Age must be a whole number\|You must be 13 or older' | head -n 1)
  printf '%-7s %s  %s\n' "\"$age\"" "$code" "${says:-?}"
done
