# SvelteKit's Other Tab Never Updated: Polling, query.live, or Quillo's live()?

Groceries: one shopping list in SQLite, open in two tabs, in Quillo (main.qwe, on 8183): `state items = live(load_items)` follows the items table, and every insert and update through db wakes every page that reads it. compare/svelte is the same list in SvelteKit 3.3.1 (Svelte 5.57.3), from Svelte's own starter (npx sv create, minimal), three ways in variants/: stale.svelte, load and form actions (the other tab never updates); poll.svelte, refreshAll every 2 seconds; live/, an experimental query.live in groceries.remote.js that waits for an EventEmitter each action emits. compare/race.mjs plays two tabs in Chromium; compare/MEASURE.md has every command and what it printed.

Written for Quillo 0.8.6 (get it at https://quillolang.org). Run it with:

```sh
./run.sh --port 8183                              # Quillo's list, on 8183
(cd compare/svelte && npm install && npm run dev)  # SvelteKit's (the stale version)
(cd compare && ./serve-variant.sh live 4183)       # a version, built and served
# Windows (PowerShell), with Quillo from quillolang.org: quillo run main.qwe --port 8183
#   and cd compare\svelte; npm install; npm run dev
```

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
