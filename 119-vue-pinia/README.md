# Vue: Emits, provide/inject, or Pinia? Sharing State Across a Page (vs Quillo)

Mixtape: what's playing and the queue in the header, and Play and Queue buttons on each of 10 tracks, in Quillo (main.qwe, on 8080): `state playing` and `state queue` at the top of the program are the page's, read by NowPlaying and set by every TrackActions. compare/vue is the same app in Vue 3.5.45 from Vue's own starter with Pinia 4.1.0 (npm create vue -- --pinia), four ways (variants/: drilling, props down and events emitted up through each level; provide, provide/inject; pinia, a store read with storeToRefs; pinia-destructure, the store destructured, which stops following). compare/play.mjs plays each in Chromium; compare/MEASURE.md has every command and what it printed.

Written for Quillo 0.8.6 (get it at https://quillolang.org). Run it with:

```sh
./run.sh                                   # Quillo's Mixtape, on 8080
(cd compare/vue && npm install && npm run dev)   # Vue's (src/ holds the pinia version)
```

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
