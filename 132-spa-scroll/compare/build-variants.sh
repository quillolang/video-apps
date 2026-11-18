#!/bin/bash
# Builds each React version for production into $1/<version> (a scratch folder): react/variants/<version>.jsx copied
# over react/src/App.jsx in turn, then naive.jsx put back.
#   naive    createBrowserRouter and Links, as React Router's docs start
#   restore  the same, with <ScrollRestoration /> in the layout
set -e
out=$1
cd "$(dirname "$0")/react"
for v in naive restore; do
  cp variants/$v.jsx src/App.jsx
  npx vite build --outDir "$out/$v" --emptyOutDir --logLevel warn
done
cp variants/naive.jsx src/App.jsx
