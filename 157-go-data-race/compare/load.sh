#!/bin/sh
# 100,000 visits, 200 at a time, to the running app at a port, and what it counted (load.mjs):
#   ./load.sh 8090        ./load.sh 8080
cd "$(dirname "$0")" && node load.mjs "${1:?give the port: 8090 for Go, 8080 for Quillo}" ${2:-} ${3:-}
