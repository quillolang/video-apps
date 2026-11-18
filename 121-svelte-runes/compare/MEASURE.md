# Svelte 5 vs Quillo, two $effect traps: the measurements

Every result in the video comes from the runs below, with what they printed, copied from the run. `../shots.mjs` runs
them and keeps the results in `../assets/runs.json`. Measured on one machine.

- **When:** Wed Nov 18 2026 11:08:33 GMT+0800 (Singapore Standard Time) (as shots.mjs started)
- **Machine:** Apple M5, 16 GB, arm64; macOS 26.7.1 (25G241)
- **Node:** v24.11.0; **npm:** 11.6.1
- **sv:** 1.5.0; **Svelte:** 5.57.3; **SvelteKit:** 3.3.1; **Vite:** 8.3.8
- **Quillo:** `quillo 0.8.6 (238dac2, 2026-11-16)`
- **Browser:** Chromium (Playwright's), headless

## The apps

- **Svelte** (`svelte/`): Svelte's own starter, `npx sv create svelte --template minimal --no-types --no-add-ons --install npm`.
  `src/routes/+page.svelte` is replaced by the timer, `src/app.css` (the same file as `../app/timer.css`) is added and
  imported by `src/routes/+layout.svelte`, which also gets `<title>Lap Timer</title>`. Every other file is the
  starter's, adapter-auto included. `variants/` holds the three versions:
  - `noteardown.svelte`: an `$effect` starts `setInterval` while `running` is true, and returns nothing;
  - `loop.svelte`: the effect returns `() => clearInterval(id)`, and a second `$effect` calls `lap()` when
    `elapsed > 0 && elapsed % 50 === 0` (an automatic lap every 5 seconds);
  - `fixed.svelte`: the automatic lap in the interval's own callback, and no second effect (`+page.svelte` is this one).
- **Quillo** (`../app/main.qwe`): the same timer. `every(100, ...)` inside `if running`, and the automatic lap as a
  statement, `if elapsed > 0 && elapsed % 50 == 0 { lap() }`. `quillo check` prints `main.qwe: ok (1 route, 1 function, 1 component)`.

Non-blank lines: Svelte's fixed.svelte 30; Quillo's main.qwe 33, with its route and the file's styles.

Svelte's docs, "$effect" (svelte.dev/docs/svelte/$effect): "Generally speaking, you should _not_ update state inside
effects, as it will make code more convoluted and will often lead to never-ending update cycles", "An effect can return
a _teardown function_ which will run immediately before the effect re-runs", and "`$effect` is best considered something
of an escape hatch".

## 1. One race in each (play.mjs)

`serve-variant.sh <version> 4173` builds each Svelte version for production (`vite build`; adapter-auto says it found
no production environment) and serves it with `vite preview`, one at a time; Quillo runs with `quillo run main.qwe`
(8080). `play.mjs` clicks Start, waits 4.5 s and 1.1 s more (an automatic lap is due at 5.0 s), clicks Lap, clicks Stop
and waits 2 s, then Start and 2 s more, then Stop.

### noteardown.svelte: gained 2.2 s in 2 s stopped, 4.3 s in 2 s after Start; console: nothing
| Step | Time | Laps | Best | First button |
|---|---|---|---|---|
| start | 0.0 s | (none) | (none) | Start |
| running4 | 4.5 s | (none) | (none) | Stop |
| running | 5.8 s | (none) | (none) | Stop |
| lap | 6.3 s | Lap 1: 5.9 s | Best lap: 5.9 s | Stop |
| stopped | 8.5 s | Lap 1: 5.9 s | Best lap: 5.9 s | Start |
| again | 12.7 s | Lap 1: 5.9 s | Best lap: 5.9 s | Stop |

### loop.svelte: console: ['error: Error: https://svelte.dev/e/effect_update_depth_exceeded']
| Step | Time | Laps | Best | First button |
|---|---|---|---|---|
| start | 0.0 s | (none) | (none) | Start |
| running4 | 4.5 s | (none) | (none) | Stop |
| running | (the timer is gone; the page says: 500 / Internal Error) | | | |

The same version in Svelte's dev server (`npx vite dev`): the page also became "500 / Internal Error", and the console said:

```
Svelte error: effect_update_depth_exceeded
Maximum update depth exceeded. This typically indicates that an effect reads and writes the same piece of state
https://svelte.dev/e/effect_update_depth_exceeded
```

### fixed.svelte: gained 0 s stopped, 2.1 s in 2 s after Start; console: nothing
| Step | Time | Laps | Best | First button |
|---|---|---|---|---|
| start | 0.0 s | (none) | (none) | Start |
| running4 | 4.7 s | (none) | (none) | Stop |
| running | 5.9 s | Lap 1: 5.0 s | Best lap: 5.0 s | Stop |
| lap | 6.4 s | Lap 1: 5.0 s, Lap 2: 1.0 s | Best lap: 1.0 s | Stop |
| stopped | 6.5 s | Lap 1: 5.0 s, Lap 2: 1.0 s | Best lap: 1.0 s | Start |
| again | 8.5 s | Lap 1: 5.0 s, Lap 2: 1.0 s | Best lap: 1.0 s | Stop |

### Quillo: gained 0 s stopped, 2 s in 2 s after Start; console: nothing
| Step | Time | Laps | Best | First button |
|---|---|---|---|---|
| start | 0.0 s | (none) | (none) | Start |
| running4 | 4.6 s | (none) | (none) | Stop |
| running | 5.8 s | Lap 1: 5.0 s | Best lap: 5.0 s | Stop |
| lap | 6.2 s | Lap 1: 5.0 s, Lap 2: 0.9 s | Best lap: 0.9 s | Stop |
| stopped | 6.3 s | Lap 1: 5.0 s, Lap 2: 0.9 s | Best lap: 0.9 s | Start |
| again | 8.3 s | Lap 1: 5.0 s, Lap 2: 0.9 s | Best lap: 0.9 s | Stop |

Downloaded to start (response bodies as sent, compressed where the server compressed them): noteardown
37345 bytes, loop 37386, fixed 37378, Quillo 45818.

## 2. Quillo's statements that set what they read (quillo-loops/)

The guide says (llms-full.txt, "When the page changes"): "No loops. Code that sets what it reads would run for ever:
after 1,000 rounds of updates the page stops and says so in the console". `quillo-loops/main.qwe` tries three shapes:
A, one statement that reads `n` and sets it; B, the automatic lap's shape; C, two statements that feed each other.
`quillo run main.qwe --port 8146` and `node try.mjs http://127.0.0.1:8146/` printed (`out.txt`):

```
A, after one click: 1
B, after five ticks: 5: 1 laps
C, after one click: 100999 100998
console error: quillo: updates go round in a loop: something sets what it reads
```

So a statement does not run again because of its own change (A and B ran once for each change of what started them),
and two statements that feed each other are stopped, with that message.
