# Vue vs Quillo, three reactivity traps: the measurements

Every result in the video comes from the runs below, with what they printed, copied from the run. `../shots.mjs` runs
them all and keeps the results in `../assets/runs.json`. Measured on one machine.

- **When:** Wed Nov 18 2026 10:51:18 GMT+0800 (Singapore Standard Time) (as shots.mjs started)
- **Machine:** Apple M5, 16 GB, arm64; macOS 26.7.1 (25G241)
- **Node:** v24.11.0 (the starters ask for ^22.18.0 or >=24.12.0: npm warned EBADENGINE, and everything below ran); **npm:** 11.6.1
- **create-vue:** 3.24.0; **Vue:** 3.5.45; **Vite:** 8.3.8; **ESLint:** 10.15.0 with **eslint-plugin-vue** 10.11.1; **vue-tsc:** 3.3.14 with **TypeScript** 6.0.3
- **Quillo:** `quillo 0.8.6 (238dac2, 2026-11-16)`
- **Browser:** Chromium (Playwright's), headless

## The apps

- **Vue** (`vue/`): Vue's own starter, `npm create vue@latest vue -- --eslint`, then `npm install`. `src/App.vue` is
  replaced by the game, `src/assets/main.css` by its styles (the same file as `../app/game.css`), and `index.html`'s
  title is "Game Night". Every other file is the starter's. `variants/` holds the four versions:
  - `destructure.vue`: `const { red, blue } = score` from `reactive({ red: 0, blue: 0 })`, shown on the buttons;
  - `value.vue`: that fixed with `toRefs(score)`; the winner compares `score.red >= target`, with `target` a `ref(5)`;
  - `reassign.vue`: the winner fixed (`target.value`), the template reads `score.red`; `let score`, and a new game does
    `score = reactive({ red: 0, blue: 0 })`;
  - `fixed.vue`: `ref()` for the score, as Vue's docs recommend; `src/App.vue` is this one.
- **Vue with TypeScript** (`vue-ts/`): `npm create vue@latest vue-ts -- --ts`, with each variant as `<script setup lang="ts">`
  and a type for `team` (`'red' | 'blue'`), for vue-tsc.
- **Quillo** (`../app/main.qwe`): the same game. `quillo check` prints `main.qwe: ok (1 route, 0 functions, 1 component)`.

Vue's docs, "Reactivity Fundamentals", "Limitations of `reactive()`" (vuejs.org/guide/essentials/reactivity-fundamentals):
"Cannot replace entire object", "Not destructure-friendly", and "Due to these limitations, we recommend using `ref()`
as the primary API for declaring reactive state."

Non-blank lines: Vue's fixed App.vue 31; Quillo's main.qwe 23, with its route.

## 1. One game in each (play.mjs)

`build-variants.sh` builds each Vue version for production (`vite build`, each copied over `src/App.vue` in turn), and
shots.mjs serves them with `vite preview` (4173 to 4176) and Quillo with `quillo run main.qwe` (8080). `play.mjs`
clicks Red three times, Red twice more, New game, then Blue once, and reads the page after each. Console errors and
warnings, in every app: none. The same three traps in Vue's dev server (`npm run dev`) gave the same screens, and no
console output either.

### destructure.vue (downloaded 26048 bytes)
| After | Red | Blue | Leader line | Winner |
|---|---|---|---|---|
| start | Red 0 | Blue 0 | First to 5. Tied | (none) |
| Red x3 | Red 0 | Blue 0 | First to 5. Red leads | (none) |
| Red x5 | Red 0 | Blue 0 | First to 5. Red leads | Red wins! |
| New game | Red 0 | Blue 0 | First to 5. Tied | (none) |
| Blue x1 | Red 0 | Blue 0 | First to 5. Blue leads | (none) |

### value.vue (26269 bytes)
| After | Red | Blue | Leader line | Winner |
|---|---|---|---|---|
| start | Red 0 | Blue 0 | First to 5. Tied | (none) |
| Red x3 | Red 3 | Blue 0 | First to 5. Red leads | (none) |
| Red x5 | Red 5 | Blue 0 | First to 5. Red leads | (none) |
| New game | Red 0 | Blue 0 | First to 5. Tied | (none) |
| Blue x1 | Red 0 | Blue 1 | First to 5. Blue leads | (none) |

### reassign.vue (26038 bytes)
| After | Red | Blue | Leader line | Winner |
|---|---|---|---|---|
| start | Red 0 | Blue 0 | First to 5. Tied | (none) |
| Red x3 | Red 3 | Blue 0 | First to 5. Red leads | (none) |
| Red x5 | Red 5 | Blue 0 | First to 5. Red leads | Red wins! |
| New game | Red 5 | Blue 0 | First to 5. Red leads | Red wins! |
| Blue x1 | Red 5 | Blue 0 | First to 5. Red leads | Red wins! |

### fixed.vue (26047 bytes)
| After | Red | Blue | Leader line | Winner |
|---|---|---|---|---|
| start | Red 0 | Blue 0 | First to 5. Tied | (none) |
| Red x3 | Red 3 | Blue 0 | First to 5. Red leads | (none) |
| Red x5 | Red 5 | Blue 0 | First to 5. Red leads | Red wins! |
| New game | Red 0 | Blue 0 | First to 5. Tied | (none) |
| Blue x1 | Red 0 | Blue 1 | First to 5. Blue leads | (none) |

### Quillo (41125 bytes)
| After | Red | Blue | Leader line | Winner |
|---|---|---|---|---|
| start | Red 0 | Blue 0 | First to 5. Tied | (none) |
| Red x3 | Red 3 | Blue 0 | First to 5. Red leads | (none) |
| Red x5 | Red 5 | Blue 0 | First to 5. Red leads | Red wins! |
| New game | Red 0 | Blue 0 | First to 5. Tied | (none) |
| Blue x1 | Red 0 | Blue 1 | First to 5. Blue leads | (none) |

Bytes are the response bodies the page downloaded to start, as sent (Vite's JavaScript and Quillo's HTML and scripts
are gzipped).

## 2. The starters' checks (lint.sh)

```
$ ./lint.sh
== destructure.vue
eslint:  no problems
vue-tsc: no errors
== value.vue
eslint:  12:16  error  Must use `.value` to read or write the value wrapped by `ref()`  vue/no-ref-as-operand
         12:53  error  Must use `.value` to read or write the value wrapped by `ref()`  vue/no-ref-as-operand
vue-tsc: src/App.vue(12,3): error TS2365: Operator '>=' cannot be applied to types 'number' and 'Ref<number, number>'.
         src/App.vue(12,39): error TS2365: Operator '>=' cannot be applied to types 'number' and 'Ref<number, number>'.
== reassign.vue
eslint:  no problems
vue-tsc: no errors
```

The starter's ESLint config (`flat/essential`) has `vue/no-ref-as-operand`. With
`--rule '{"vue/no-ref-object-reactivity-loss": "error"}'` added, the results are the same: it reports nothing for
destructure.vue or reassign.vue.
