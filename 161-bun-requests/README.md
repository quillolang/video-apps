# Requests a Second: Bun and Hono vs Quillo, the Same Page, the Same Machine

The Trail Guide of videos 128, 143 and 147, in Quillo (main.qwe, on 8080): a page for each trail, its styles in the page. compare/hono is the same site in Hono 4.13.19 on Bun 1.4.3 (src/index.tsx, on 8090), its styles in the page too, so both send the same page (Quillo's adds its link-prefetch script). compare/bench.sh asks a running site for /trails/2 for ten seconds with wrk (4 threads, 100 connections); compare/MEASURE.md has every round, what each server used, and the machine's load.

Written for Quillo 0.8.6 (get it at https://quillolang.org). Run it with:

```sh
./run.sh   # Quillo's Trail Guide, on 8080 (./run.sh --instances 4: on four cores)
(cd compare/hono && bun install && bun run src/index.tsx)   # Hono's, on 8090
(cd compare && ./bench.sh 8080 && ./bench.sh 8090)   # needs wrk
# Windows (PowerShell), with Quillo from quillolang.org and Bun from bun.sh: quillo run main.qwe
```

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
