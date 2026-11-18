# A Dashboard on a Slow Phone: React SPA vs Server-Rendered Quillo, Under Lighthouse

Hearth Bakery's October dashboard, in Quillo (main.qwe, on 8080): 1,080 sales added up on the server as it starts (revenue, orders, items, by product, the latest orders) and the whole page sent at once, with no JavaScript. compare/react is the same dashboard as a single-page app in React 19.3.1 from Vite's starter: it fetches sales.json once it has loaded, and adds it up in the browser. compare/lh runs Lighthouse 13.6.0 on each, with its default simulated throttling and with applied throttling; compare/filmstrip.mjs takes screenshots of each loading on a slowed network and CPU. compare/MEASURE.md has every command and what it printed.

Written for Quillo 0.8.6 (get it at https://quillolang.org). Run it with:

```sh
./run.sh                                     # Quillo's dashboard, on 8080
(cd compare/react && npm install && npm run build && npx vite preview)   # React's, on 4173
(cd compare/lh && npm install && node run.mjs react=http://localhost:4173/ quillo=http://localhost:8080/ --applied)
# Windows (PowerShell), with Quillo from quillolang.org: quillo run main.qwe
```

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
