#!/bin/sh
# Builds the Dioxus side for release (dx build: the server and the browser's wasm), at background priority, and
# copies what its server needs to .cache/rust-target/v202/dioxus/ inside quillo-videos, else to compare/.build/dioxus/
# (the runs start it from there).
#   sh compare/build.sh        the log goes to compare/runs/build-dioxus.txt
set -eu
here=$(cd "$(dirname "$0")" && pwd); root=$(cd "$here/../../.." && pwd)
if [ -f "$root/engine/build.mjs" ]; then build=$root/.cache/rust-target/v202; target=$root/.cache/rust-target/v202-target
else build=$here/.build; target=$here/.build/target; fi
out=$build/dioxus
export PATH="$root/.cache/rust-tools/bin:$HOME/.cargo/bin:$PATH" CARGO_BUILD_JOBS=4
log=$here/runs/build-dioxus.txt
cd "$here/dioxus"
{ printf '$ dx build --release --platform web\n'; CARGO_TARGET_DIR=$target dx build --release --platform web 2>&1; } > "$log" || { tail -40 "$log"; exit 1; }
web=$target/dx/bench/release/web
rm -rf "$out"; mkdir -p "$out"; cp -R "$web/." "$out/"
for f in "$out"/public/assets/*; do grep -q "$(basename "$f")" "$out/.manifest.json" || rm "$f"; done
sed -i '' "s|$HOME|/Users/you|g" "$log"
ls -la "$out"
