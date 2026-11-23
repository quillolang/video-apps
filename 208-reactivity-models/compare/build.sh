#!/bin/sh
# Builds the five apps (and the two variants: React with its compiler, Dioxus with the signal row) for production into .build/<name> (served by serve.mjs) and logs each build in runs/.
#   sh build.sh            (from compare/; Quillo's app, ../app, needs no build)
set -eu
cd "$(dirname "$0")"
mkdir -p runs .build
for d in react react-compiler vue svelte solid; do
  (cd $d && { printf '$ npx vite build\n'; npx vite build 2>&1; }) > runs/build-$d.txt
  rm -rf .build/$d
  if [ $d = solid ]; then cp -R $d/dist/client .build/$d; else cp -R $d/dist .build/$d; fi
done
# What React Compiler made of App: the same build, not minified, App's function saved as runs/compiled-app.js
(cd react-compiler && npx vite build --minify false --outDir ../.build/react-compiler-plain --emptyOutDir > /dev/null 2>&1)
awk '/^function App\(\) \{/{on=1} on{print} on&&/^}/{exit}' .build/react-compiler-plain/assets/index-*.js > runs/compiled-app.js
target=${CARGO_TARGET_DIR:-$HOME/dev/quillo-videos/.cache/rust-target/v208}
# dx bundles the newest wasm in its target and keeps old files in public/: each build gets its own target and an
# empty public/, so the copy holds that build alone.
rm -rf "$target/dx/groceries/release/web/public"
touch dioxus/src/main.rs
(cd dioxus && { printf '$ dx build --release --platform web --debug-symbols false\n'; CARGO_TARGET_DIR=$target dx build --release --platform web --debug-symbols false 2>&1; }) > runs/build-dioxus.txt
rm -rf .build/dioxus
cp -R "$target/dx/groceries/release/web/public" .build/dioxus
# The variant: Row given the items signal in place of two handlers (variants/dioxus-signal-row.rs)
rm -rf .build/src-dioxus-signal .build/dioxus-signal
mkdir -p .build/src-dioxus-signal
cp -R dioxus/Cargo.toml dioxus/Dioxus.toml dioxus/assets dioxus/src .build/src-dioxus-signal/
cp variants/dioxus-signal-row.rs .build/src-dioxus-signal/src/main.rs
rm -rf "$target-signal/dx/groceries/release/web/public"
(cd .build/src-dioxus-signal && { printf '$ dx build --release --platform web --debug-symbols false   # variants/dioxus-signal-row.rs\n'; CARGO_TARGET_DIR=$target-signal dx build --release --platform web --debug-symbols false 2>&1; }) > runs/build-dioxus-signal.txt
cp -R "$target-signal/dx/groceries/release/web/public" .build/dioxus-signal
printf '.build/\nnode_modules/\ndist/\n' > .gitignore
ls .build
# Logs say /Users/you for the home folder
sed -i.bak "s#$HOME#/Users/you#g" runs/*.txt && rm -f runs/*.txt.bak
