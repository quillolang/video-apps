#!/bin/sh
# Calls a running trails API the same seven ways (calls.mjs), and prints the table:
#   ./calls.sh spring=http://localhost:5100        ./calls.sh quillo=http://localhost:5101
cd "$(dirname "$0")" && node calls.mjs "$@" > calls.json
