#!/bin/sh
# Three holes tried on both running sites (holes.mjs): Go on trail.localhost:8092, Quillo on :8080.
cd "$(dirname "$0")" && node holes.mjs go=http://trail.localhost:8092 quillo=http://trail.localhost:8080 "$@" > holes.json
