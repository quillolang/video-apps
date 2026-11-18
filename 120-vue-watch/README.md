# Vue's watch Never Fired: 3 Changes, 0 Saves, and a Reload That Lost Them (vs Quillo)

Settings that save themselves in localStorage, in Quillo (main.qwe, on 8184): a change makes a new settings value, and the save is a statement that reads it, so it runs again on every change (and once at the start, like watchEffect); the saved settings are read once the page is on screen (onmount), and saving starts after that. steps/first-try is the version that saved before reading, and lost the settings on a reload; steps/inplace sets settings.theme.dark in place, which the browser refuses. compare/vue is the same page in Vue 3.5.45 from Vue's own starter (npm create vue -- --eslint), three ways in variants/: shallow.vue, watch(settings), which never fires on a nested change; deep.vue, with { deep: true }; effect.vue, watchEffect. compare/play.mjs makes three changes in Chromium, counts the saves and reloads; compare/MEASURE.md has every command and what it printed.

Written for Quillo 0.8.6 (get it at https://quillolang.org). Run it with:

```sh
./run.sh --port 8184                              # Quillo's settings, on 8184
(cd compare/vue && npm install && npm run dev)     # Vue's (App.vue is shallow.vue; variants/ has the others)
# Windows (PowerShell), with Quillo from quillolang.org: quillo run main.qwe --port 8184
#   and cd compare\vue; npm install; npm run dev
```

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
