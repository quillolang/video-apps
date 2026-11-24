# How the numbers in "Services" were measured

One Mac (Apple M5, 10 cores, darwin 25.6.0), quillo 0.8.10 (61997ab, 2026-11-22) from its release. Other work was running on the machine at the
same time (load 27). `MEASURE.json` is the run the video shows.

`node compare/measure.mjs` (macOS or Linux: it stops servers with signals) starts each server itself: the shop
(`main.qwe`) on port 8250, billing on 8251 when it runs on its own, and `peek.mjs` on 8252. Before it:
`sh get-quillo.sh`, so `.quillo/bin/quillo` is there. Each experiment starts from an empty `billing.db`.

| Experiment | What it does |
|---|---|
| speed | 300 buys one after another (after 50 to warm up): median and 99th percentile; then 3,000 buys, 50 at a time: buys a second. In one process, `--split`, and `--split --scale billing=3`; 3 rounds each, the medians kept |
| wire | billing on its own (`--as-service`), the shop calling it through `peek.mjs`, which prints the call and saves it as `logs/call-1.json`; then that call sent again: unsigned, with its amount changed, and as it was (twice); a call made by hand; and the browser's address for server fns |
| down | the shop with `--service-url billing=http://127.0.0.1:8251` and nothing there: 7 buys |
| hanging | billing with `BILLING_DELAY=5000` (5 s an invoice), the shop's timeout 2 s and 1 retry: 6 buys, then billing's summary once it has finished |
| scale | `--split --scale billing=3`: 7 buys, then the summary 3 times |

What the run shows:

| | One process | --split | --split --scale billing=3 |
|---|---|---|---|
| a buy, one at a time (median) | 0.20 ms | 0.45 ms | 0.40 ms |
| 99th percentile | 1.67 ms | 2.98 ms | 2.90 ms |
| buys a second, 50 at a time | 9,708 | 3,752 | 2,694 |

- wire: unsigned 401, amount changed 401, the same call twice 200 and 200 with the same invoice; afterwards `{"served": 1, "invoices": 1}`. A call by hand: 401; `/_quillo/rpc/invoice`: 404.
- down: 503 in 150.5 ms, 503 in 160.8 ms, 503 in 0.3 ms, 503 in 0.1 ms, 503 in 0.1 ms, 503 in 0.1 ms, 503 in 0.1 ms (the circuit opened after the third buy's first try).
- hanging: 503 in 2,169 ms, 503 in 2,139 ms, 503 in 2,153 ms, 503 in 9 ms, 503 in 2 ms, 503 in 12 ms; afterwards `{"served": 3, "invoices": 3}`.
- scale: invoices #1 to #7; the summaries `{"served": 2, "invoices": 7}`, `{"served": 2, "invoices": 7}`, `{"served": 3, "invoices": 7}`.

The terminal scenes' output is in `logs/`, as the programs printed it: `split.txt`, `wire.txt` (peek.mjs),
`refused.txt` (the replay commands, `replay.mjs`), `down.txt`, `hanging.txt`, `scale.txt`, `miss.txt` (the shop with its
`??` line deleted: check says ok, the request is a 500), `docs-contracts.txt` (`quillo docs billing.qwe`, its contracts).
