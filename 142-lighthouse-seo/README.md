# SEO With JavaScript Off: a React SPA vs a Quillo Site (Lighthouse, curl, and a Blank Page)

Hearth Bakery's bread pages, in Quillo (main.qwe, on 8080): a list and a page for each bread, each sent whole from the server with its own title and description, a real 404 for a bread it doesn't have, and robots.txt. compare/spa is the same site as a single-page app in React 19.3.1 from Vite's starter, with React Router 8.5.1 (React 19 puts each page's <title> and <meta> into the head). compare/lh runs Lighthouse 13.6.0 (run.mjs: all four categories; seo.mjs: SEO, with --no-scripts to block the page's scripts); compare/seen.sh shows what curl gets from each. compare/MEASURE.md has every command and what it printed.

Written for Quillo 0.8.6 (get it at https://quillolang.org). Run it with:

```sh
./run.sh                                     # Quillo's site, on 8080
(cd compare/spa && npm install && npm run build && npx vite preview)   # React's, on 4173
(cd compare && ./seen.sh http://localhost:8080 && ./seen.sh http://localhost:4173)
# Windows (PowerShell), with Quillo from quillolang.org: quillo run main.qwe
```

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
