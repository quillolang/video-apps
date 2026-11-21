#!/bin/sh
# Builds one Rust side in release mode, as its starter sets it up, and copies what its server needs out of the
# target folder into .cache/rust-target/v200/<side>/ (servers.mjs runs them from there). Background priority, 2 jobs.
#   sh build.sh leptos | leptos-async | dioxus      (the log goes to runs/build-<side>.txt)
# leptos-async is leptos with ssr=SsrMode::Async on its routes (versions/app.async.rs in place of src/app.rs);
# dioxus-tuned is dioxus with the size settings of Dioxus's guide (versions/Cargo.tuned.toml in place of Cargo.toml).
set -eu
side=$1
here=$(cd "$(dirname "$0")" && pwd); root=$(cd "$here/../../.." && pwd)
out=$root/.cache/rust-target/v200/$side
target=${TARGET_DIR:-$root/.cache/rust-target/v200-target}
export PATH="$root/.cache/rust-tools/bin:$HOME/.cargo/bin:/usr/bin:/bin:/usr/sbin" CARGO_BUILD_JOBS=2
mkdir -p "$here/runs"
log=$here/runs/build-$side.txt
case $side in
leptos|leptos-async)
  cd "$here/leptos"
  if [ "$side" = leptos-async ]; then cp src/app.rs "$target-app.rs.keep"; cp versions/app.async.rs src/app.rs; fi
  { printf '$ cargo leptos build --release\n'; CARGO_TARGET_DIR=$target/leptos taskpolicy -b cargo leptos build --release 2>&1; } > "$log" || status=$?
  if [ "$side" = leptos-async ]; then cp "$target-app.rs.keep" src/app.rs; rm "$target-app.rs.keep"; fi
  [ "${status:-0}" = 0 ] || { tail -30 "$log"; exit 1; }
  rm -rf "$out"; mkdir -p "$out"
  cp "$target/leptos/release/trails" "$out/"
  cp -R target/site "$out/site"
  ;;
dioxus|dioxus-tuned)
  cd "$here/dioxus"
  if [ "$side" = dioxus-tuned ]; then cp Cargo.toml "$target-Cargo.toml.keep"; cp versions/Cargo.tuned.toml Cargo.toml; fi
  { printf '$ dx build --release --platform web\n'; CARGO_TARGET_DIR=$target/$side taskpolicy -b dx build --release --platform web 2>&1; } > "$log" || status=$?
  if [ "$side" = dioxus-tuned ]; then cp "$target-Cargo.toml.keep" Cargo.toml; rm "$target-Cargo.toml.keep"; fi
  [ "${status:-0}" = 0 ] || { tail -30 "$log"; exit 1; }
  web=$target/$side/dx/trails/release/web
  rm -rf "$out"; mkdir -p "$out"
  cp -R "$web/." "$out/"
  # dx keeps earlier builds' hashed files beside the new ones: keep only what this build's manifest lists.
  for f in "$out"/public/assets/*; do grep -q "$(basename "$f")" "$out/.manifest.json" || rm "$f"; done
  ;;
esac
sed -i '' "s|$HOME|/Users/you|g" "$log"   # the logs are published: no home path in them
ls -la "$out"
