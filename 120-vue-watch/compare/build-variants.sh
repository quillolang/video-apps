#!/bin/bash
# Builds each Vue version for production into $1/<version> (a scratch folder): vue/variants/<version>.vue copied
# over vue/src/App.vue in turn, then shallow.vue put back.
set -e
out=$1
cd "$(dirname "$0")/vue"
for v in shallow deep effect; do
  cp variants/$v.vue src/App.vue
  npx vite build --outDir "$out/$v" --emptyOutDir --logLevel warn
done
cp variants/shallow.vue src/App.vue
