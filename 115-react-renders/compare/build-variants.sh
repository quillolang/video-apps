#!/bin/bash
# Builds each React version for production, into $1 (a scratch folder): react, memo and memo+useCallback from
# react/variants/ (plain, memo, fixed: each copied over react/src/App.jsx in turn, then plain put back), and
# with the React Compiler starter: compiler (its App.jsx is plain's) and compiler+updater (functional.jsx).
# With a second argument, a products file (10,000 of them), the builds use it and go to $1/<version>-10k.
set -e
out=$1; big=$2; sfx=
cd "$(dirname "$0")"
# The Quillo app: ../app in the video's own folder, .. in github.com/quillolang/video-apps.
app=../app; [ -d "$app" ] || app=..
if [ -n "$big" ]; then sfx=-10k; cp "$big" react/src/products.json; cp "$big" react-compiler/src/products.json; fi
cd react
for v in plain memo fixed; do
  cp variants/$v.jsx src/App.jsx
  npx vite build --outDir "$out/$v$sfx" --emptyOutDir --logLevel warn
done
cp variants/plain.jsx src/App.jsx
cd ../react-compiler
cmp variants/plain.jsx ../react/variants/plain.jsx
for v in plain functional; do
  cp variants/$v.jsx src/App.jsx
  npx vite build --outDir "$out/compiler-$v$sfx" --emptyOutDir --logLevel warn
done
cp variants/plain.jsx src/App.jsx
cd ..
cp "$app/products.json" react/src/products.json; cp "$app/products.json" react-compiler/src/products.json
if [ -n "$big" ]; then
  mkdir -p "$out/quillo-10k"; cp "$app/main.qwe" "$app/shop.css" "$out/quillo-10k/"; cp "$big" "$out/quillo-10k/products.json"
fi
