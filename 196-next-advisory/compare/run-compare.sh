#!/bin/sh
# The Next.js side of the video, run for real: each command and what it printed go to runs/NN-name.txt, which the
# video's terminal scenes show. Node 26.13.1 (LTS, from nodejs.org, kept in .cache/node26) with its npm 11.20.0.
# Trail Club's admin app (next/) starts on Next.js 15.2.2, one of the versions GHSA-f82v-jwr5-mffw (CVE-2025-29927)
# affects; npm audit and GitHub's advisory database say what is known about it, then it's upgraded step by step.
# No attack is run: only the advisories, the audits, the upgrades and the builds. The project is copied to a temp folder
# first, so no paths of this machine's show. Quillo's side: its changelog and advisories, from GitHub.
#   sh videos/196-next-advisory/compare/run-compare.sh
set -u
here=$(cd "$(dirname "$0")" && pwd); root=$(cd "$here/../../.." && pwd)
work=$(mktemp -d "${TMPDIR:-/tmp}/trail-admin.XXXXXX")
runs=$here/runs; rm -rf "$runs"; mkdir -p "$runs"
GH=$(command -v gh)
mkdir -p "$work/bin"; ln -s "$GH" "$work/bin/gh"
export PATH="$root/.cache/node26/bin:$work/bin:/usr/bin:/bin" npm_config_cache="$work/npm-cache" npm_config_update_notifier=false \
  npm_config_fund=false NEXT_TELEMETRY_DISABLED=1 TERM=dumb NO_COLOR=1 FORCE_COLOR=0
run() {
  name=$1; dir=$2; shift 2
  { echo "\$ $*"; (cd "$dir" && sh -c "$*" 2>&1); } | sed 's/\x1b\[[0-9;]*m//g' > "$runs/$name.txt"
}
mkdir -p "$work/trail-admin"; (cd "$here/next" && tar cf - --exclude node_modules --exclude .next .) | (cd "$work/trail-admin" && tar xf -)
A=$work/trail-admin
# The app as it was: Next.js 15.2.2 (kept under other names in versions/, so the repository's scanners don't flag it), and
# the admin page that trusts the middleware.
cp "$A/versions/package.json.15.2.2" "$A/package.json"; cp "$A/versions/package-lock.json.15.2.2" "$A/package-lock.json"
cp "$A/versions/admin.v1.js" "$A/app/admin/page.js"
(cd "$A" && npm ci --silent)

# What GitHub's advisory database says (gh api, public data).
run 01-advisory "$A" "gh api /advisories/GHSA-f82v-jwr5-mffw --jq '.summary, .severity, .published_at'"
run 02-advisory-fixed "$A" "gh api /advisories/GHSA-f82v-jwr5-mffw --jq '.vulnerabilities[].first_patched_version'"

# Next.js 15.2.2, as the app was.
run 03-versions "$A" "node --version && npm ls next | grep next@"
run 04-audit-count "$A" "npm audit | grep -c github.com/advisories"
run 05-audit-middleware "$A" "npm audit | grep f82v"
run 06-audit-summary "$A" "npm audit | grep -E '^[0-9]+ vulnerabilit'"

# The patch for that one advisory.
run 07-patch "$A" "npm install --silent --save-exact next@15.2.3 && npm ls next | grep next@"
run 08-patch-middleware "$A" "npm audit | grep f82v || echo 'no match'"
run 09-patch-new "$A" "npm audit | grep 223j"
run 09b-patch-new-fixed "$A" "gh api /advisories/GHSA-223j-4rm8-mrmf --jq '.severity, .published_at, .vulnerabilities[].vulnerable_version_range'"

# The latest 15.x, then the latest.
run 10-latest15 "$A" "npm install --silent --save-exact next@15 && npm ls next | grep next@"
run 11-latest15-audit "$A" "npm audit | grep -E '^[a-z@/.-]+ +[<>=]|^Severity|vulnerabilit'"
run 12-latest "$A" "npm install --silent --save-exact next@16 && npm ls next | grep next@"
run 13-latest-audit "$A" "npm audit"
run 14-latest-build "$A" "npm run build --silent 2>&1 | grep -i -E 'middleware|proxy' | head -3"

# Quillo's side: its own security fixes, from its repository.
"$GH" api /repos/quillolang/quillo/contents/CHANGELOG.md --jq .content | base64 -d > "$work/CHANGELOG.md"
run 15-quillo-advisories "$work" "gh api /repos/quillolang/quillo/security-advisories --jq length"
run 16-quillo-security-sections "$work" "grep -c '^### Security' CHANGELOG.md"
run 17-quillo-070 "$work" "grep -A1 'One viewer.s .live. answer' CHANGELOG.md"
run 18-quillo-supported "$work" "gh api /repos/quillolang/quillo/contents/SECURITY.md --jq .content | base64 -d | grep 'before 1.0'"

date '+%Y-%m-%d %H:%M %Z' > "$runs/00-date.txt"
rm -rf "$work"
ls "$runs"
