#!/bin/sh
# Sends the same seven bodies to POST /api/signups and prints each answer's status and body, then what was saved:
#   ./send.sh http://localhost:3101
url=$1/api/signups
send() {
	out=$(curl -s -w '\n%{http_code}' -H 'Content-Type: application/json' -d "$2" "$url")
	printf '%-14s %s %s\n' "$1" "$(echo "$out" | tail -1)" "$(echo "$out" | sed '$d' | tr -d '\n' | cut -c1-96)"
}
send "good"         '{"name":"Ana","email":"ana@example.com","guests":2}'
send "no email"     '{"name":"Ben","guests":1}'
send "no guests"    '{"name":"Fay","email":"fay@example.com"}'
send "guests: two"  '{"name":"Cy","email":"cy@example.com","guests":"two"}'
send "paid: true"   '{"name":"Di","email":"di@example.com","guests":0,"paid":true}'
send "bad values"   '{"name":"","email":"nope","guests":-3}'
send "not JSON"     '{"name":"Ed",'
printf '%-14s %s\n' "saved" "$(curl -s "$url" | cut -c1-100)"
