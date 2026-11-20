# A Chat with WebSockets: Bun vs Quillo's Channels, and the Restart That Went Quiet

Trail Club's chat in Quillo (main.qwe, on 8175): channel.on broadcasts each line to every page, and a component opens the channel with channel.open, shows what it hears and sends what's typed. POST /say lets another program (curl) post a line. steps/v1 is the chat alone. compare/chat is the same chat with Bun 1.4.3's WebSockets, from bun init: Bun.serve with an HTML import, server.upgrade and Bun's pub/sub (ws.subscribe, server.publish), and a page script with a WebSocket; variants/reconnect has a page that opens its socket again and keeps what's sent meanwhile; talk.ts is a program in the chat. compare/restart.mjs restarts each server under two tabs, compare/wt-restart.mjs does it over WebTransport, others.mjs and weight.mjs measure the rest; compare/MEASURE.md has every command and what it printed.

Written for Quillo 0.8.6 (get it at https://quillolang.org). Run it with:

```sh
./run.sh --port 8175   # Quillo's: http://localhost:8175
(cd compare/chat && bun install && NODE_ENV=production bun index.ts)   # Bun's: http://localhost:3000
(cd compare && npm install playwright && node restart.mjs bun out.json && node restart.mjs quillo out.json)
# Windows (PowerShell), with Quillo from quillolang.org: quillo run main.qwe --port 8175
```

## The versions in the video

The video builds this app up step by step. Each step is a folder that runs on its own (`cd steps/v1 && ./run.sh --watch`):

- [`steps/v1`](steps/v1): the chat: a channel, and a component that opens it
- this folder: a route other programs can post to (POST /say, which broadcasts)

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
