#!/bin/sh
# Posts one order to the running Hono app (8090) or Quillo app (8080), with the fields given changed:
#   ./order.sh hono loaves=two        ./order.sh quillo loaves=02 name=
cd "$(dirname "$0")"
case $1 in hono) port=8090; name=Hono ;; quillo) port=8080; name=Quillo ;; *) echo "usage: ./order.sh hono|quillo [field=value ...]" >&2; exit 2 ;; esac
shift
node order.mjs "$name" "$port" "$@"
