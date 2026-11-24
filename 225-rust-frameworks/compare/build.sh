#!/bin/sh
# Builds one side from clean, in release mode, as its starter or guide builds it, and records the build in
# runs/build-<side>.json: the seconds the build took (the crates are fetched first, so downloading is not counted),
# the packages in Cargo.lock, and the size of what is deployed. What the server needs is copied to
# $BUILDS/<side>/ (.cache/rust-target/v225/ in quillo-videos), and the target folder is deleted (the disk is small).
#   sh build.sh axum | axum-tuned | actix | rocket | leptos | dioxus | yew
set -eu
side=$1
here=$(cd "$(dirname "$0")" && pwd); root=$(cd "$here/../../.." && pwd)
builds=${BUILDS:-$root/.cache/rust-target/v225}   # in video-apps: BUILDS=/somewhere/with/room sh build.sh axum
out=$builds/$side
target=$builds-target/$side
export PATH="$root/.cache/rust-tools/bin:$HOME/.cargo/bin:/usr/bin:/bin:/usr/sbin"
log=$here/runs/build-$side.txt
rm -rf "$target" "$out"; mkdir -p "$out" "$(dirname "$target")"
cd "$here/$side"
case $side in
axum|axum-tuned|actix|rocket) cmd="cargo build --release" ;;
leptos) cmd="cargo leptos build --release" ;;
dioxus) cmd="dx build --release --platform web" ;;
yew) cmd="trunk build --release && cargo build --release --manifest-path api/Cargo.toml" ;;
esac
cargo fetch > /dev/null 2>&1 || true
[ "$side" = yew ] && (cd api && cargo fetch > /dev/null 2>&1 || true)
start=$(python3 -c 'import time; print(time.time())')
{ printf '$ %s\n' "$cmd"; CARGO_TARGET_DIR=$target sh -c "$cmd" 2>&1; } > "$log" || { tail -30 "$log"; exit 1; }
secs=$(python3 -c "import time; print(round(time.time() - $start, 1))")
case $side in
axum|axum-tuned|actix|rocket) cp "$target/release/guestbook" "$out/" ;;
leptos) cp "$target/release/guestbook" "$out/"; cp -R target/site "$out/site" ;;
dioxus) cp -R "$target/dx/guestbook/release/web/." "$out/"
  for f in "$out"/public/assets/*; do grep -q "$(basename "$f")" "$out/.manifest.json" || rm "$f"; done ;;
yew) cp "$target/release/guestbook-api" "$out/"; cp -R dist "$out/dist" ;;
esac
pkgs=$(grep -c '^name = ' Cargo.lock)
[ "$side" = yew ] && pkgs="$pkgs+$(grep -c '^name = ' api/Cargo.lock)"
bytes=$(du -sk "$out" | awk '{print $1 * 1024}')
printf '{"side": "%s", "cmd": "%s", "seconds": %s, "packages": "%s", "deployed_bytes": %s, "rustc": "%s", "cores": %s, "load": "%s"}\n' \
  "$side" "$cmd" "$secs" "$pkgs" "$bytes" "$(rustc --version)" "$(sysctl -n hw.ncpu)" "$(sysctl -n vm.loadavg)" > "$here/runs/build-$side.json"
sed -i '' "s|$HOME|/Users/you|g" "$log"
rm -rf "$target"
cat "$here/runs/build-$side.json"
