#!/bin/sh
# One login through each running site (login.mjs), and every page request on the way: Go, then Quillo.
cd "$(dirname "$0")" && node login.mjs go=http://trail.localhost:8092 quillo=http://trail.localhost:8080 "$@" > login.json
