#!/bin/sh
# What anyone gets, signed out, with curl: the admin page, the orders' data, and (for the Vue app) the admin page's
# own code, the chunk the router loads for /admin.
#   ./curl.sh http://localhost:4175 /api/orders        (Vue)
#   ./curl.sh http://localhost:8080 /admin/orders.json (Quillo)
base=$1; data=$2
show() { printf '%-31s %s\n' "$1" "$2"; }
show "/admin" "$(curl -s -o /dev/null -w '%{http_code} %{redirect_url}' "$base/admin")"
body=$(curl -s -w '\n%{http_code}' "$base$data")
show "$data" "$(echo "$body" | tail -1) $(echo "$body" | sed '$d' | cut -c1-60)"
chunk=$(curl -s "$base/" | grep -o '/assets/index-[^"]*\.js' | head -1)
if [ -n "$chunk" ]; then
	admin=/assets/$(curl -s "$base$chunk" | grep -o 'AdminView-[A-Za-z0-9_-]*\.js' | head -1)
	code=$(curl -s -w '\n%{http_code}' "$base$admin")
	show "$admin" "$(echo "$code" | tail -1), and it asks for $(echo "$code" | grep -o '/api/[a-z]*' | head -1)"
fi
