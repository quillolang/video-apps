#!/bin/sh
# The video's terminal scenes, run for real: each `$ command` and what it printed goes to runs/<name>.txt.
# Needs the builds (sh build.sh leptos; sh build.sh leptos-async; sh build.sh dioxus) and the compile-error runs
# (sh errors.sh). Commands run in a temp folder, so no path of this machine shows; each server started here is
# stopped by its own process.
#   sh videos/200-rust-fullstack/compare/run-compare.sh
set -u
here=$(cd "$(dirname "$0")" && pwd); root=$(cd "$here/../../.." && pwd); video=$(cd "$here/.." && pwd)
app=$video/app; [ -f "$app/main.qwe" ] || app=$video    # in video-apps, the app is the folder itself
work=$(mktemp -d "${TMPDIR:-/tmp}/trail-guide.XXXXXX")
runs=$here/runs; mkdir -p "$runs"
mkdir -p "$work/bin"; ln -s "$app/.quillo/bin/quillo" "$work/bin/quillo"
export PATH="$work/bin:$root/.cache/node26/bin:$root/.cache/rust-tools/bin:$HOME/.cargo/bin:/usr/bin:/bin:/usr/sbin" TERM=dumb NO_COLOR=1
run() { name=$1; dir=$2; shift 2; { printf '$ %s\n' "$*"; (cd "$dir" && sh -c "$*" 2>&1); } > "$runs/$name.txt"; }

# The three projects, as they are in compare/ and app/, copied without their build folders.
for s in leptos dioxus; do mkdir -p "$work/$s"; (cd "$here/$s" && tar cf - --exclude target --exclude versions .) | (cd "$work/$s" && tar xf -); done
mkdir -p "$work/quillo"; cp "$app/main.qwe" "$app/trails.css" "$app/trails.json" "$app/reviews.json" "$work/quillo/"
B=$root/.cache/rust-target/v200

run 01-versions "$work" "rustc --version && cargo leptos --version && dx --version && quillo version"
run 02-lines "$work" "wc -l leptos/src/*.rs dioxus/src/main.rs quillo/main.qwe"
run 03-check "$work/quillo" "quillo check main.qwe"
for v in quillo-title quillo-fold; do
  mkdir -p "$work/$v"; cp "$here/$v/main.qwe" "$here/$v/trails.css" "$here/$v/trails.json" "$here/$v/reviews.json" "$work/$v/"
  run "03-check-$v" "$work/$v" "quillo check main.qwe"
done
run 04-sizes "$B" "ls -l leptos/trails leptos/site/pkg/trails.wasm dioxus/server dioxus/public/assets/*.wasm dioxus-tuned/public/assets/*.wasm | awk '{ print \$5, \$9 }'"

# The servers, from their release builds.
node "$here/servers.mjs" leptos leptos-async dioxus quillo > "$work/servers.log" 2>&1 & SP=$!
i=0; until grep -q '^quillo ' "$work/servers.log" 2>/dev/null || [ $i -gt 600 ]; do sleep 0.25; i=$((i + 1)); done

# What each server sends for /trails/2: the start of its <main>.
run 10-main-leptos "$work" "curl -s localhost:8210/trails/2 | grep -o '<main[^>]*>.\{0,52\}'"
run 11-main-dioxus "$work" "curl -s localhost:8211/trails/2 | grep -o '<main[^>]*>.\{0,64\}'"
run 12-main-quillo "$work" "curl -s localhost:8200/trails/2 | grep -o '<main[^>]*>.\{0,96\}'"
run 12-h1-quillo "$work" "curl -s localhost:8200/trails/2 | grep -o '<h1>[^<]*'"
run 13-main-leptos-async "$work" "curl -s localhost:8212/trails/2 | grep -o '<main[^>]*>.\{0,52\}'"
# The title each sends.
for s in leptos:8210 dioxus:8211 quillo:8200; do
  run "14-title-${s%%:*}" "$work" "curl -s localhost:${s#*:}/trails/2 | grep -o '<title>[^<]*</title>'"
done
# The status of three addresses.
for s in leptos:8210 dioxus:8211 quillo:8200; do
  run "15-status-${s%%:*}" "$work" "for p in /trails/2 /trails/99 /nope; do curl -s -o /dev/null -w \"\$p %{http_code}\\\\n\" localhost:${s#*:}\$p; done"
done

kill "$SP" 2>/dev/null; wait "$SP" 2>/dev/null

# What each browser downloaded, from measure.sh's runs (probe.mjs gzips each script and wasm file it got).
run 20-downloads "$here" "for s in leptos dioxus dioxus-tuned quillo; do printf '%-13s' \$s; grep 'all of it' runs/probe-\$s.txt | awk '{ print \$(NF-3), \$(NF-2), \$(NF-1), \$NF }'; done"
date '+%Y-%m-%d %H:%M %Z' > "$runs/00-date.txt"
rm -rf "$work"
ls "$runs"
