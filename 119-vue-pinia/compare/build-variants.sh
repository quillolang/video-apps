#!/bin/bash
# Builds each Vue version for production into $1/<version> (a scratch folder): vue/variants/<version>/ (App.vue,
# components/, and stores/ for Pinia) copied into vue/src/ in turn, with variants/tracks.js; then pinia put back.
# The starter's own components/ and stores/counter.js stay beside them, unused.
set -e
out=$1
cd "$(dirname "$0")/vue"
use() { cp variants/tracks.js src/tracks.js; cp -R variants/$1/. src/; }
for v in drilling provide pinia-destructure pinia; do
  use $v
  npx vite build --outDir "$out/$v" --emptyOutDir --logLevel warn
done
use pinia
