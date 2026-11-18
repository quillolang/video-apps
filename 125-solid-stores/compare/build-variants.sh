#!/bin/bash
# Builds each Solid version for production into $1/<version> (a scratch folder): solid/variants/<version>.jsx copied
# over solid/src/App.jsx in turn (board.js beside it), then draft.jsx put back. The starter's build writes the page to
# dist/client whatever --outDir says, so each is copied from there; serve.mjs serves the copy.
set -e
out=$1
cd "$(dirname "$0")/solid"
cp variants/board.js src/board.js
for v in draft outside spread; do
  cp variants/$v.jsx src/App.jsx
  npx vite build --logLevel warn
  rm -rf "$out/$v"; mkdir -p "$out/$v"; cp -R dist/client/. "$out/$v/"
done
cp variants/draft.jsx src/App.jsx
