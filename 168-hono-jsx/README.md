# JSX on the Server: Hono vs Quillo's Views, and the Link That Ran Code

Trail Club's notes board in Quillo (main.qwe, on 8132): visitors leave a note with their name and a link, and the page shows them all, inside a layout view (Page, with children). A view escapes what it puts in the page, and a link's javascript: or vbscript: address is sent as about:blank#blocked. compare/hono is the same board in Hono 4.13.19 on Bun 1.4.3 (src/index.tsx: jsxRenderer for the layout, bun:sqlite), and variants/safe-link.tsx, which checks a link's scheme. compare/payloads.mjs posts four notes that try to run code and opens the page in a browser; compare/links.py posts nine links; compare/MEASURE.md has every command and what it printed.

Written for Quillo 0.8.6 (get it at https://quillolang.org). Run it with:

```sh
./run.sh --port 8132   # Quillo's board: http://127.0.0.1:8132
(cd compare/hono && bun install && bun run src/index.tsx)   # Hono's: http://localhost:3000
(cd compare && node payloads.mjs hono out.json && node payloads.mjs quillo out.json)
# Windows (PowerShell), with Quillo from quillolang.org: quillo run main.qwe --port 8132
```

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
