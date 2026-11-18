#!/bin/sh
# A billion cookies, and the home page asked for meanwhile, on the running app at a port (crack.mjs):
#   ./crack.sh 8000        ./crack.sh 8080
cd "$(dirname "$0")" && node crack.mjs "${1:?give the port: 8000 for Deno, 8080 for Quillo}"
