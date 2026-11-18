#!/bin/bash
# The provider and the club's four sites, each on a host of its own, until stopped (Ctrl-C). In this folder as it's
# published (main.qwe here, the provider and the Express sites in compare/): run compare/idp's and compare/express's
# `npm install` first. Then open http://trail.localhost:8080 and http://photos.localhost:8081 (Quillo), or :3000 and
# :3001 (Express).
cd "$(dirname "$0")"
trap 'kill 0' EXIT
(cd compare/idp && node provider.mjs) &
sleep 2
for s in "3000 Trail_Club trail" "3001 Photo_Album photos"; do set -- $s
  (cd compare/express && PORT=$1 SITE="${2/_/ }" CLIENT_ID=$3-express CLIENT_SECRET=$3-express-secret \
    BASE=http://$3.localhost:$1 SESSION_SECRET=dev node app.js) &
done
for s in "8080 Trail_Club trail" "8081 Photo_Album photos"; do set -- $s
  SITE="${2/_/ }" CLIENT_ID=$3-quillo CLIENT_SECRET=$3-quillo-secret BASE=http://$3.localhost:$1 ./run.sh --port $1 &
done
wait
