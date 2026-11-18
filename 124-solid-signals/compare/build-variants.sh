#!/bin/bash
# Builds each Solid version for production into $1/<version> (a scratch folder): solid/variants/<version>.jsx copied
# over solid/src/App.jsx in turn, then fixed.jsx put back. The starter's build (Solid's start mode) writes the page to
# dist/client whatever --outDir says, so each is copied from there; vite preview --outDir serves the copy.
set -e
out=$1
cd "$(dirname "$0")/solid"
for v in body destructure fixed; do
  cp variants/$v.jsx src/App.jsx
  npx vite build --logLevel warn
  rm -rf "$out/$v"; mkdir -p "$out/$v"; cp -R dist/client/. "$out/$v/"
done
cp variants/fixed.jsx src/App.jsx
