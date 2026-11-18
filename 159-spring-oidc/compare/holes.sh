#!/bin/sh
# Three holes tried on both running sites (holes.mjs): Spring Boot on trail.localhost:8091, Quillo on :8080.
cd "$(dirname "$0")" && node holes.mjs spring=http://trail.localhost:8091,/oauth2/authorization/club,/login/oauth2/code/club \
  quillo=http://trail.localhost:8080 "$@" > holes.json
