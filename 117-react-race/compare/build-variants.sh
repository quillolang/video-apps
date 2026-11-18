#!/bin/bash
# Builds each React version for production into $1/<version> (a scratch folder): react/variants/<version>.jsx copied
# over react/src/App.jsx in turn, then effect.jsx put back.
set -e
out=$1
cd "$(dirname "$0")/react"
for v in effect ignore query; do
  cp variants/$v.jsx src/App.jsx
  npx vite build --outDir "$out/$v" --emptyOutDir --logLevel warn
done
cp variants/effect.jsx src/App.jsx
