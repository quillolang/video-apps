# A chat with WebSockets, Bun and Quillo: the measurements

Every result in the video comes from the runs below, copied from the run. Each script starts the server it measures,
drives real browser tabs (Playwright's Chromium, headless), and stops only that server. What each printed is in
`<script>-<side>.txt` here; the full results, every round, are in `../assets/<script>-<side>.json`.

- **When:** Fri Nov 20 2026; `bun init` at 16:56 +08; the runs in the video from 17:18 to 17:23 (`runs-when.txt`), the
  screenshots after them
- **Machine:** Apple M5, arm64; macOS 26.7.1. **Busy:** other sessions were working; the load average (1, 5 and 15
  minutes) was 18.60 10.44 7.01 as the runs began and 19.39 17.78 11.78 as they ended. Nothing here is a speed
  measurement, but the reconnect times are seconds on a busy machine.
- **Bun:** 1.4.3, with @types/bun 1.4.5 and typescript 7.0.2 from `bun init` (`init.txt`: 7 packages)
- **Quillo:** `quillo 0.8.6 (238dac2, 2026-11-16)` (the app folder's own, from its get-quillo.sh); also checked with
  `quillo 0.8.8 (6e18cda, 2026-11-20)` for the findings below
- **Browser:** Chromium (Playwright 1.63.0), headless; Google Chrome for the feedback repros

## The two chats

Trail Club's chat room: each visitor types a name and a line, and every open page shows `name: line`.

- **Bun** (`chat/`, made with `bun init -y`, which wrote index.ts, package.json, tsconfig.json, README.md and
  .gitignore, and installed @types/bun; it also wrote `.cursor/rules/use-bun-instead-of-node-vite-npm-pnpm.mdc`, an
  editor's rule file, removed). Written from Bun's own docs (`node_modules/bun-types/docs/runtime/http/websockets.mdx`,
  "Pub/Sub", and `guides/websocket/pubsub.mdx`):
  - `index.ts`: `Bun.serve` with `routes` (`"/"` is `index.html`, an HTML import; `"/chat"` calls
    `server.upgrade(req)`) and `websocket` (`open`: `ws.subscribe("chat")`; `message`: `server.publish("chat", ...)`).
  - `index.html` and `chat.ts`: the page; `chat.ts` opens `new WebSocket(ws://<host>/chat)`, appends each message as
    a list item's `textContent`, and sends `{ name, text }` as JSON from the form.
  - `tsconfig.json`: `"lib": ["ESNext", "DOM"]` (the starter's is `["ESNext"]`, for server code; the page's script needs
    the DOM's types). `bun check`: `✓ No type errors in 5 files`.
  - Run as Bun's docs say to deploy: `NODE_ENV=production bun index.ts` (port 3000). Without it, `Bun.serve` runs in
    development mode, which adds a hot-reload client (`/_bun/client/...`) to the page.
  - `variants/reconnect/`: the same server (`diff` with `index.ts`: none) and page; its `chat.ts` opens the socket in a
    `connect()` function, calls `connect` again a second after `close`, and keeps lines sent while the socket isn't
    open in a list, sent on `open`.
  - `talk.ts`: a program in the chat: `bun talk.ts "hi from the terminal"` sends one line as Bot, prints what it hears
    for two seconds, and closes.
- **Quillo** (`../steps/v1/main.qwe`): `channel.on("chat", ...)` broadcasts `name: text` to every page in the channel;
  `component Chat` opens it with `channel.open("chat", ...)`, adds each line to a state, and sends from the form.
  `quillo check`: `main.qwe: ok (1 route, 0 functions, 1 component)`. `../app/main.qwe` adds `route POST /say`, which
  broadcasts a line a program posts (`quillo check`: `ok (2 routes, 0 functions, 1 component)`). Run with
  `quillo run main.qwe --port 8175`.

Lines (non-blank, not comments): Bun `index.ts` 21, `index.html` 14, `chat.ts` 15: **50 in 3 files**;
with `variants/reconnect/chat.ts` (26) in place of `chat.ts`: **61**. Quillo `steps/v1/main.qwe`: **25 in 1 file**.

## A restart (restart.mjs)

`node restart.mjs <side> <out.json> 5`: five rounds, each from a fresh server and two fresh tabs, Ana and Ben, each in
a browser context of their own, at `http://localhost:<port>/`:

1. Ana says "hello", and after 1 s each tab's list is read;
2. the server is stopped (SIGTERM to its process group), 1 s later Ana says "anyone there?", 1 s later the lists;
3. the same command starts the server again; 5 s later Ben says "back again", and 1.5 s later the lists.

The first round is printed in full; each round's summary says whether each tab heard "back again", whether Ana's
"anyone there?" reached each tab, and how long after the server started again each tab's connection opened.

**Bun** (`restart-bun.txt`): both tabs deaf after the restart, in all five rounds. The console, each tab, each round:
`WebSocket is already in CLOSING or CLOSED state.` (what Chrome logs for a `send` on a closed socket; nothing is thrown).

```
server started; 5 s later, Ben: back again
  Ana's tab: ["Ana: hello"]
  Ben's tab: ["Ana: hello"]
5 rounds: {"ana_back":0,"ben_back":0,"waiting_line_reached_ana":0,"waiting_line_reached_ben":0}
```

**Bun, reconnecting** (`restart-bun-reconnect.txt`): both tabs back in every round, 0.4 to 0.9 s after the server;
Ana's waiting line reached Ben in 4 rounds of 5 (in round 2, Ana's page was back first: Ben's tab
`["Ana: hello","Ben: back again"]`).

**Quillo** (`restart-quillo.txt`): both tabs back by themselves in every round: 1.1 to 1.6 s after the server in four
rounds; 8.6 s in round 5, where the server itself took about 3.5 s to start on the busy machine (round 5's
snapshots at 1.5, 3.9 and 18.6 s, against about 1.3, 3.8 and 10.5 to 11.2 s in the others; in round 1 the server
answered about 0.2 s after it was started), so the page's retry, which waits
longer each time ("after half a second, then longer, up to 15 s", the guide), came later. Ana's waiting line reached
Ben in 5 rounds of 5 here. The pages were on the WebSocket (`/_quillo/wt`): Chromium tried WebTransport first and was
refused (`Failed to establish a connection to https://localhost:8175/_quillo/wt?…: net::ERR_CONNECTION_REFUSED`), see
below.

```
server started; 5 s later, Ben: back again
  Ana's tab: ["Ana: hello","Ana: anyone there?","Ben: back again"]
  Ben's tab: ["Ana: hello","Ana: anyone there?","Ben: back again"]
5 rounds: {"ana_back":5,"ben_back":5,"waiting_line_reached_ana":5,"waiting_line_reached_ben":5}
```

Whether Ben sees Ana's waiting line is a race on both sides: it goes out as soon as Ana's page is back, and a page
that isn't back yet misses it (neither keeps lines for a page that's away). Earlier runs the same afternoon, before
the files' long lines were broken for the video (the same code otherwise), gave Ben the line in 4 and 3 rounds of 5
for Quillo, and 4 and 4 for Bun reconnecting. Every other result was the same in those runs.

## Over WebTransport (wt-restart.mjs)

Quillo's page takes WebTransport where it can. At `localhost` it can't here: Quillo listens for it on UDP
`127.0.0.1:8175` only, and Chromium dials `[::1]` for QUIC (FEEDBACK80, Q-1266). At `http://127.0.0.1:8175/` it
does: no WebSocket opened, no console error. `node wt-restart.mjs <out.json>`: Ana and Ben at 127.0.0.1; Ana says
"hello"; the server stops and starts again; then Ben says "ping N" every 2 s until Ana's tab shows one.

```
before the restart: Ana's tab ["Ana: hello"], Ben's tab ["Ana: hello"]
Ana first heard "Ben: ping 10", 23.7 s after the restart
Ben's tab: ["Ana: hello","Ben: ping 2","Ben: ping 3","Ben: ping 4","Ben: ping 5","Ben: ping 6","Ben: ping 7","Ben: ping 8","Ben: ping 9","Ben: ping 10"]
WebSockets opened: Ana 0, Ben 0 (WebTransport otherwise)
```

Ben's page was back within a few seconds (pings 2 to 9 reached his own tab), Ana's, which only listened, after
23.7 s; "ping 1" reached no one. The same run gave 25.2 s (ping 7) earlier, and 23.0 s on 0.8.6 and 23.1 s on 0.8.8
(6e18cda) in a first version of the script. The server doesn't close WebTransport sessions when it stops, so a page
finds out from its keep-alive ("dropped after 20 s of silence", the guide). Reported as FEEDBACK80, Q-1265, with a
repro in Chrome (the page first heard a line posted 11 or 12 s after the restart; at localhost, over the WebSocket,
the first, 1 s after).

## A program in the chat (others.mjs)

`node others.mjs <side> <out.json>`: Ana's tab open; the program runs; a second in, Ana says "hi bot".

```
$ bun talk.ts "hi from the terminal"
Bot: hi from the terminal
Ana: hi bot
(exit 0)
Ana's tab: ["Bot: hi from the terminal","Ana: hi bot"]
```

```
$ curl -si -d name=Bot -d "text=hi from the terminal" localhost:8175/say
HTTP/1.1 204 No Content
x-request-id: …
x-content-type-options: nosniff
server: Quillo
(exit 0)
Ana's tab: ["Bot: hi from the terminal","Ana: hi bot"]
```

(The `date:` header is left out of the printed lines by the script.) Quillo has no WebSocket of your own: "Upgrades are
taken only on Quillo's own paths (live data, channels, `--watch`); a route gets a plain request" (the guide, 0.8.6).
A program can post through a route, as here, but not listen.

## What each page downloads (weight.mjs)

`node weight.mjs <side> <out.json>`: every response for the page, 3 s after it opens (the socket left out): bytes as
sent (`request.sizes().responseBodySize`) and as unpacked.

```
200 /  text/html: 384 bytes sent, 384 unpacked
200 /chunk-5z4fy5g3.js  text/javascript: 411 bytes sent, 411 unpacked
2 files: 795 bytes sent, 795 unpacked
```

```
200 /  text/html (gzip): 1742 bytes sent, 3760 unpacked
200 /_quillo/b/11d65dbe36565807.js  text/javascript (gzip): 815 bytes sent, 1847 unpacked
200 /_quillo/r/e4d25b6fd5c4ec40.js  text/javascript (gzip): 43108 bytes sent, 153396 unpacked
200 /_quillo/wt-ticket  application/json: 189 bytes sent, 189 unpacked
4 files: 45854 bytes sent, 159192 unpacked
```

Quillo's `/_quillo/r/...js` is the runtime for components (43,108 of the 45,854 bytes). Bun's page script is bundled
and minified by Bun at start (production mode), and sent without compression.

## The screenshots (../shots.mjs)

`node videos/175-bun-chat/shots.mjs`: the steps of restart.mjs once for Bun, Bun reconnecting and Quillo (steps/v1),
at 520×300, device scale 3: `hello_<side>` (Ben's tab after "hello"), `after_<side>_ana` and `after_<side>_ben` (after
"back again").

## Not measured

- Speed: messages a second, latency, memory. Other sessions were measuring on this machine; nothing here is a benchmark.
- Binary messages: Bun sends ArrayBuffers and typed arrays as binary frames (its docs); a Quillo channel's message is a
  value as JSON, "bytes go as a list of numbers; there is no binary message" (the guide). Not run.
- Another site's page opening the socket: Bun's docs warn of it and show an `Origin` check; with no sign-in in either
  chat, it gives an attacker nothing a script couldn't do directly, so it isn't in the video.
- Firefox and Safari.
