#!/bin/bash
# Builds each React version for production into $1/<version> (a scratch folder): react/variants/<version>.jsx copied
# over react/src/App.jsx in turn (trails.js beside it), then naive.jsx put back.
set -e
out=$1
cd "$(dirname "$0")/react"
cp variants/trails.js src/trails.js
for v in naive loader; do
  cp variants/$v.jsx src/App.jsx
  npx vite build --outDir "$out/$v" --emptyOutDir --logLevel warn
done
cp variants/naive.jsx src/App.jsx
