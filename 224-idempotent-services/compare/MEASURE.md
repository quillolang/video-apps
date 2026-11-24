# How the numbers in "Bill Once" were measured

One Mac (Apple M5, 10 cores, darwin 25.6.0), quillo 0.8.10 (61997ab, 2026-11-22) from its release. Other work was running on the machine at the
same time (load 28). `MEASURE.json` is the run the video shows.

Two versions of the shop: `steps/v1` (no `idempotent`) and the final one (in video-apps, this folder; in
quillo-videos, `app/`): `idempotent` in billing's `invoice`, a form marked `idempotent`, and the buy route in
`idempotent({ transaction: false }, ...)`. `node compare/measure.mjs` (macOS or Linux) starts every server itself:
the shop on 8250, billing on 8251 when it runs on its own. Before it: `sh get-quillo.sh`.

| Experiment | What it does | v1 | final |
|---|---|---|---|
| twice | the same buy sent twice (the same Idempotency-Key) | 200 Invoice #1 for Ada: $12.00; 200 Invoice #2 for Ada: $12.00; 2 invoices | 200 Invoice #1 for Ada: $12.00; 200 Invoice #1 for Ada: $12.00 (replayed); 1 invoice |
| crash: the buy | billing with `BILLING_PAUSE=3000`, killed (SIGKILL) 0.8 s into a buy | 503 Billing is busy. Try again in a moment. | 503 Billing is busy. Try again |
| crash: invoices | after billing is started again | 1 | 0 |
| crash: the same key again | | 200 Invoice #2 for Ada: $12.00 | 503 Billing is busy. Try again (replayed) |
| crash: a new key | what Try again gives | 200 Invoice #3 for Ada: $12.00 | 200 Invoice #1 for Ada: $12.00 |
| cost: a buy | 300 one after another, each a new key, `--split`; median of 3 runs | 1.81 ms | 1.47 ms |
| cost: the same key | 300 more, one key | 1.25 ms (billed each time) | 0.13 ms (replayed) |
| invoices | after those 650 buys | 650 | 351 |

v1's three rounds: 1.18, 1.82, 1.81 ms; the final version's: 1.45, 1.47, 1.53 ms.
The difference between the two is smaller than the spread between runs on this busy machine.

The browser test (Back, then Buy again) is in `shots.mjs` in quillo-videos: v1 shows Invoice #2, the final version
Invoice #1, replayed (a real Chromium; a double click there sent one request only, so the video doesn't claim it).
The terminal scenes' output is in `logs/`: `crash-*-shop.txt` and `crash-*-billing.txt`, `warning.txt` (`quillo check`
with `{ transaction: false }` taken out) and `form.txt` (the form's hidden key).
