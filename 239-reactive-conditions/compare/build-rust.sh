#!/bin/sh
# Builds the Dioxus or Leptos page (or a variant folder made from one) for the web, in release mode, as its tool
# builds it, into .build/<name>/ for serve.mjs. Each gets its own target folder (dx bundles the newest wasm in a target).
#   sh build-rust.sh dioxus|leptos [folder] [name]
set -eu
here=$(cd "$(dirname "$0")" && pwd); root=$(cd "$here/../../.." && pwd)
kind=$1; dir=${2:-$here/$kind}; name=${3:-$kind}
export PATH="$root/.cache/rust-tools/bin:$HOME/.cargo/bin:$PATH"
target=$root/.cache/rust-target/v239/$name
mkdir -p "$here/runs" "$here/.build"; rm -rf "$here/.build/$name"
log=$here/runs/build-$name.txt
cd "$dir"
case $kind in
dioxus) cmd="dx build --release --platform web --debug-symbols false"; rm -rf "$target/dx/inbox/release/web/public" ;;
leptos) cmd="trunk build --release --dist $here/.build/$name" ;;
esac
code=0
{ printf '$ %s\n' "$cmd"; CARGO_TARGET_DIR=$target sh -c "$cmd" 2>&1; } > "$log" || code=$?
sed -i '' "s|$HOME|/Users/you|g" "$log"
[ $code = 0 ] || { echo "$name: build failed ($code), see $log"; exit $code; }
[ $kind = dioxus ] && cp -R "$target/dx/inbox/release/web/public" "$here/.build/$name"
echo "$name: built in .build/$name"
