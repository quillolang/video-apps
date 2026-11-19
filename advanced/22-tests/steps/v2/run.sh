#!/bin/sh
# Runs this folder's main.qwe with the quillo in .quillo/bin/, which
# get-quillo.sh put there, and puts there first when it is not:
#
#   ./run.sh --watch            the options are quillo run's: --port 8081, --reload
set -eu
here=$(cd "$(dirname "$0")" && pwd)
if [ ! -x "$here/.quillo/bin/quillo" ]; then sh "$here/get-quillo.sh"; fi
exec "$here/.quillo/bin/quillo" run "$here/main.qwe" "$@"
