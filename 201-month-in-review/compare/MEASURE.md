# This Month in Web Stacks, November 2026: what was run

Run on one machine on 2026-11-22: Apple M5, 16 GB; macOS 26.7.1. Node.js v24.11.0 (behind the November 11 fix, 24.22.3, as the video says).
Quillo: `quillo 0.8.10 (61997ab, 2026-11-22)`. Next.js: 16.4.4 (`create-next-app@16.4.4`, JavaScript, App Router, the
starter's own `next.config.mjs` with Cache Components on) and 16.4.5 (the same app, `npm install next@16.4.5`).
Every page was opened in Chromium (Playwright's, headless) by `../shots.mjs`; the terminal text in the video is copied from
`run-*.txt`, saved as each command printed it (`../make-video.py` checks the narration against them).

## Folders

- `next/` — Next.js 16.4.4, dev server on 3011: `pages/api/login.js` (an Edge API route that sets an HttpOnly cookie) and `app/leak/page.js`.
- `next-fixed/` — the same on 16.4.5, dev server on 3012, plus `app/greeting/route.js` (cookies() and cache-control: public).
- `next-csp/` — 16.4.5, production build (`next build`, `next start` on 3013): a checkout with a static
  `Content-Security-Policy: default-src 'self'` from `next.config.mjs` `headers()`, and the greeting route.
- `next-nonce/` — 16.4.5, production build on 3014: the nonce from Next.js's guide (node_modules/next/dist/docs/01-app/02-guides/content-security-policy.md),
  `proxy.js` as the guide writes it; the page needed `export const instant = false` beside `await connection()` (the build named it, with Cache Components on).
- `vendor/vendor.mjs` — the stand-in third-party script host on 9900 (local only): reviews.js shows a review and posts the card field's value to /collect.
- `quillo-env/main.qwe` — a component that reads `env()`, for `quillo check`'s error.

## What each page showed (Chromium)

| Page | What the page's script saw / what happened |
|---|---|
| 16.4.4 /leak, Log in | document.cookie: "" · x-middleware-set-cookie: "session=ana-7f3c9e21; Path=/; HttpOnly; SameSite=lax" |
| 16.4.5 /leak, Log in | document.cookie: "" · x-middleware-set-cookie: "null" |
| Quillo /leak, Log in | document.cookie: "" · x-middleware-set-cookie: "null" (cookie: __Host-quillo_session, HttpOnly; Secure; SameSite=Lax) |
| Quillo /checkout, + then a card number | 2 tickets: $25.00; the review loaded; vendor.mjs printed "collected a card number: 4242 4242 4242 4242" |
| Quillo /checkout-safe (site_headers CSP) | 2 tickets: $25.00; "Loading reviews…"; the console: reviews.js refused by script-src; nothing collected |
| Next.js 16.4.5 /checkout, static CSP | "1 ticket: $12.50" after clicking + (Next.js's inline scripts refused too; 9 console errors) |
| Next.js 16.4.5 /checkout, the guide's nonce | 2 tickets: $25.00; reviews.js refused by script-src |

## Tried and not shown

GHSA-rhh4-g77r-r9qj (binary `use cache` arguments): a route handler calling a `'use cache'` function with a Uint8Array, a
subarray view, a Blob, a 4,000-byte array and an ArrayBuffer, for "ana" and "ben", on 16.4.4's dev server: each user got their own
result. The advisory's conditions weren't met by these tries, so the video describes the cache advisories and doesn't claim a demo.

## Sources

- https://nextjs.org/blog/november-2026-security-release (Nov 3; 16.4.5 and 15.5.29; seven advisories)
- https://nodejs.org/en/blog/vulnerability/november-2026-security-releases (Nov 11; 22.23.5, 24.22.3, 26.13.1; sixteen CVEs)
- https://www.bleepingcomputer.com/news/security/fandango-says-hackers-stole-payment-card-details-from-checkout-pages/ (Nov 16; Oct 8–11)
- https://cursor.com/blog/security-incident-update (Nov 13) and https://fireworks.ai/security/bulletins/october-2026-security-incident-update
- https://techcrunch.com/2026/10/30/applebees-exposed-customers-personal-data-after-leaving-database-password-in-app/
- https://bun.com/blog/bun-v1.4.5 (Nov 19), https://github.com/dotnet/core/releases (v11.0.0, Nov 10), npm's `next` times (16.4.6: Nov 9)
- https://github.com/quillolang/quillo/releases (v0.8.9 Nov 20, v0.8.10 Nov 22)
