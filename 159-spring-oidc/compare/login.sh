#!/bin/sh
# One login through each running site (login.mjs), and every page request on the way: Spring Boot, then Quillo.
cd "$(dirname "$0")" && node login.mjs spring=http://trail.localhost:8091 quillo=http://trail.localhost:8080 "$@" > login.json
