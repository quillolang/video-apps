#!/bin/sh
# The Vite and Next.js side of the video, run for real: each command and what it printed go to runs/NN-name.txt,
# which the video's terminal scenes show. Node 26.13.1 (LTS, from nodejs.org, kept in .cache/node26) with its npm.
# Each project is copied to a temp folder first and installed from its lockfile, so the output has no paths of
# this machine's (and no "multiple lockfiles" warning from Next.js about this repository's own).
# The keys are made up: Payly is a made-up payment provider.
#   sh videos/195-bundle-secrets/compare/run-compare.sh
set -u
here=$(cd "$(dirname "$0")" && pwd); root=$(cd "$here/../../.." && pwd)
work=$(mktemp -d "${TMPDIR:-/tmp}/bake-sale.XXXXXX")
runs=$here/runs; rm -rf "$runs"; mkdir -p "$runs"
export PATH="$root/.cache/node26/bin:/usr/bin:/bin" npm_config_cache="$work/npm-cache" npm_config_update_notifier=false \
  npm_config_fund=false NEXT_TELEMETRY_DISABLED=1 TERM=dumb NO_COLOR=1 FORCE_COLOR=0
# run NAME DIR COMMAND: the command, as the viewer types it, and its output (colour codes taken out)
run() {
  name=$1; dir=$2; shift 2
  { echo "\$ $*"; (cd "$dir" && sh -c "$*" 2>&1); } | sed 's/\x1b\[[0-9;]*m//g' > "$runs/$name.txt"
}
copy() { mkdir -p "$work/$2"; (cd "$here/$1" && tar cf - --exclude node_modules --exclude dist --exclude .next .) | (cd "$work/$2" && tar xf -); (cd "$work/$2" && npm ci --silent); }

# Vite (React starter, create-vite 9.3.4)
copy vite bake-sale-vite; V=$work/bake-sale-vite
run 01-versions "$V" "node --version && npm --version && npx vite --version"
cp "$V/versions/App.v1.jsx" "$V/src/App.jsx"; cp "$V/versions/env.v1" "$V/.env"
run 02-vite-env1 "$V" "cat .env"
run 03-vite-build1 "$V" "npm run build --silent | tail -4"
run 04-vite-grep1 "$V" "grep -o 'Bearer [a-z0-9_]*' dist/assets/*.js"
cp "$V/versions/App.v2.jsx" "$V/src/App.jsx"; cp "$V/versions/env.v2" "$V/.env"
run 05-vite-env2 "$V" "cat .env"
run 06-vite-build2 "$V" "npm run build --silent | tail -4"
run 07-vite-grep2 "$V" "grep -o 'Bearer [a-z0-9_]*' dist/assets/*.js"
printf "import { defineConfig } from 'vite'\nexport default defineConfig({ envPrefix: '' })\n" > "$V/vite.everything.config.js"
run 08-vite-empty-prefix "$V" "npx vite build --config vite.everything.config.js 2>&1 | head -2"

# Next.js (create-next-app 16.4.6: JavaScript, App Router)
copy next bake-sale-next; N=$work/bake-sale-next
run 09-next-version "$N" "npx next --version"
cp "$N/versions/pay.v1.js" "$N/app/pay.js"; cp "$N/versions/env.v1" "$N/.env"
run 10-next-env1 "$N" "cat .env"
run 11-next-build1 "$N" "npm run build --silent | tail -7"
run 12-next-grep1 "$N" "grep -rl payly_secret .next/static || echo 'no match'"
cp "$N/versions/pay.v2.js" "$N/app/pay.js"; cp "$N/versions/env.v2" "$N/.env"; rm -rf "$N/.next"
run 13-next-env2 "$N" "cat .env"
run 14-next-build2 "$N" "npm run build --silent | tail -7"
run 15-next-grep2 "$N" "grep -rho 'Bearer payly_[a-z0-9_]*' .next/static"
cp "$N/versions/pay.v3.js" "$N/app/pay.js"; cp "$N/versions/actions.v3.js" "$N/app/actions.js"; cp "$N/versions/env.v3" "$N/.env"; rm -rf "$N/.next"
run 16-next-env3 "$N" "cat .env"
run 17-next-build3 "$N" "npm run build --silent | tail -7"
run 18-next-grep3 "$N" "grep -rl payly_secret .next/static || echo 'no match'"
run 19-next-pub3 "$N" "grep -rho 'payly_pub_[a-z0-9_]*' .next/static | sort -u"

date '+%Y-%m-%d %H:%M %Z' > "$runs/00-date.txt"
rm -rf "$work"
ls "$runs"
