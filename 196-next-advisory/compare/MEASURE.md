# A critical bug. Would you know? What was run

`run-compare.sh` keeps each command and what it printed in `runs/`: GitHub's advisory database (`gh api`), npm audit and the
upgrades of `next/` (from a temp copy, installed from its lockfile), and Quillo's changelog and security policy. No attack was run.
`../shots.mjs` takes the screenshots. `../make-video.py` checks the narration against both.

- **When:** 2026-11-21 15:24 +08
- **Machine:** Apple M5, 16 GB; macOS 26.7.1
- **Node:** 26.13.1 (LTS), from nodejs.org, with its npm 11.20.0
- **Quillo:** `quillo 0.8.8 (f35bf2d, 2026-11-19)`

```
$ gh api /advisories/GHSA-f82v-jwr5-mffw --jq '.summary, .severity, .published_at'
Authorization Bypass in Next.js Middleware
critical
2025-03-21T15:20:12Z

$ gh api /advisories/GHSA-f82v-jwr5-mffw --jq '.vulnerabilities[].first_patched_version'
13.5.9
14.2.25
15.2.3
12.3.5

$ node --version && npm ls next | grep next@
v26.13.1
└── next@15.2.2

$ npm audit | grep -c github.com/advisories
47

$ npm audit | grep f82v
Authorization Bypass in Next.js Middleware - https://github.com/advisories/GHSA-f82v-jwr5-mffw

$ npm audit | grep -E '^[0-9]+ vulnerabilit'
3 vulnerabilities (2 high, 1 critical)

$ npm install --silent --save-exact next@15.2.3 && npm ls next | grep next@
└── next@15.2.3

$ npm audit | grep f82v || echo 'no match'
no match

$ npm audit | grep 223j
Next.js may leak x-middleware-subrequest-id to external hosts - https://github.com/advisories/GHSA-223j-4rm8-mrmf

$ gh api /advisories/GHSA-223j-4rm8-mrmf --jq '.severity, .published_at, .vulnerabilities[].vulnerable_version_range'
low
2025-04-02T22:35:37Z
= 12.3.5
= 13.5.9
= 14.2.25
= 15.2.3

$ npm install --silent --save-exact next@15 && npm ls next | grep next@
└── next@15.5.29

$ npm audit | grep -E '^[a-z@/.-]+ +[<>=]|^Severity|vulnerabilit'
postcss  <=8.5.22
Severity: high
2 vulnerabilities (1 moderate, 1 high)

$ npm install --silent --save-exact next@16 && npm ls next | grep next@
└── next@16.4.6

$ npm audit
found 0 vulnerabilities

$ npm run build --silent 2>&1 | grep -i -E 'middleware|proxy' | head -3
⚠ The "middleware" file convention is deprecated. Please use "proxy" instead.
  npx @next/codemod@canary middleware-to-proxy .
  Learn more: https://nextjs.org/docs/messages/middleware-to-proxy

$ gh api /repos/quillolang/quillo/security-advisories --jq length
0

$ grep -c '^### Security' CHANGELOG.md
4

$ grep -A1 'One viewer.s .live. answer' CHANGELOG.md
- **One viewer's `live` answer could reach another, for up to two seconds, in 0.7.0 and
  before: upgrade.** A `live` run is shared between viewers unless its code read the request.

$ gh api /repos/quillolang/quillo/contents/SECURITY.md --jq .content | base64 -d | grep 'before 1.0'
Quillo is before 1.0: fixes go into the latest release only.

```

Quillo: `quillo check` in app/: `main.qwe: ok (3 routes, 1 function, 0 components)`. In the browser: /admin goes to `/login`; after "Sign in as Ana", `/admin` shows "Signed in as Ana".
