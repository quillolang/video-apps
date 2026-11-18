# Svelte 5 $effect: a Timer That Won't Stop, and a 500 Error at 5 Seconds (vs Quillo)

Lap Timer: start, stop, laps by hand, and a lap by itself every 5 seconds, in Quillo (main.qwe, on 8080): every() inside `if running` stops when running turns false, and the automatic lap is a statement. compare/svelte is the same timer in Svelte 5.57.3 with SvelteKit 3.3.1, from Svelte's own starter (npx sv create, minimal), with variants/ for two $effect traps (noteardown.svelte: an interval with no teardown; loop.svelte: the automatic lap as an effect that reads and writes the laps) and fixed.svelte. compare/play.mjs times one race in each in Chromium; compare/MEASURE.md has every command and what it printed.

Written for Quillo 0.8.6 (get it at https://quillolang.org). Run it with:

```sh
./run.sh                                       # Quillo's timer, on 8080
(cd compare/svelte && npm install && npm run dev)    # Svelte's (+page.svelte is fixed.svelte)
(cd compare && ./serve-variant.sh loop 4173)         # a trap, built and served
```

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
