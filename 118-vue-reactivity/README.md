# Vue's Screen Stopped Updating, With No Error in the Console: 3 Reactivity Traps vs Quillo

Game Night: two teams, first to 5, and a new game, in Quillo (main.qwe, on 8080): the score is a state, red and blue a destructured let that follows it, and a new game gives it a new value. compare/ has the same game in Vue 3.5.45, from Vue's own starters: vue/ (npm create vue -- --eslint) with variants/ for three reactivity traps (destructure.vue: red and blue taken out of a reactive(); value.vue: a ref compared without .value; reassign.vue: a new game replaces the reactive object) and fixed.vue (ref, as Vue's docs recommend), and vue-ts/ (npm create vue -- --ts) for vue-tsc. compare/play.mjs plays a game in each in Chromium; compare/lint.sh runs the starters' ESLint and vue-tsc; compare/MEASURE.md has every command and what it printed.

Written for Quillo 0.8.6 (get it at https://quillolang.org). Run it with:

```sh
./run.sh                                   # Quillo's game, on 8080
(cd compare/vue && npm install && npm run dev)   # Vue's (src/App.vue is fixed.vue)
(cd compare && ./lint.sh)                  # each trap through ESLint and vue-tsc
```

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
