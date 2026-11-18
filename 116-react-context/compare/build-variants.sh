#!/bin/bash
# Builds each React version for production into $1/<version> (a scratch folder): react/variants/<version>.jsx
# copied over react/src/App.jsx in turn (pastries.js beside it), then drilling.jsx put back.
set -e
out=$1
cd "$(dirname "$0")/react"
cp variants/pastries.js src/pastries.js
for v in drilling context zustand; do
  cp variants/$v.jsx src/App.jsx
  npx vite build --outDir "$out/$v" --emptyOutDir --logLevel warn
done
cp variants/drilling.jsx src/App.jsx
