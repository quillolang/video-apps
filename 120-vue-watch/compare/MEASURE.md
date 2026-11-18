# Vue vs Quillo, an autosave that watches nested settings: the measurements

Every result in the video comes from the runs below, copied from what they printed. `../shots.mjs` runs them and keeps
the results in `../assets/runs.json`. Measured on one machine.

- **When:** Wed Nov 18 2026 13:30:08 GMT+0800 (Singapore Standard Time) (as shots.mjs started)
- **Machine:** Apple M5, 16 GB, arm64; macOS 26.7.1 (25G241)
- **Node:** v24.11.0; **npm:** 11.6.1
- **Vue:** 3.5.45; **Vite:** 8.3.8; **ESLint:** 10.15.0 with **eslint-plugin-vue** 10.11.1; **oxlint:** 1.82.0
- **Quillo:** `quillo 0.8.6 (238dac2, 2026-11-16)`
- **Browser:** Chromium (Playwright's), headless

## The apps

- **Vue** (`vue/`): Vue's own starter, `npm create vue@latest vue -- --eslint`, then `npm install` (12.8 s with an empty
  npm cache; 272 packages in package-lock.json). `src/assets/main.css` is replaced by `../app/settings.css` (the same
  file), `index.html` gets `<title>Settings</title>`, and `src/App.vue` is one of `variants/`:
  - `shallow.vue`: `const settings = ref(...)`, `v-model` on `settings.theme.dark`, `settings.theme.size` and
    `settings.email.news`, a computed summary, and `watch(settings, ...)` that saves to localStorage;
  - `deep.vue`: the same watch with `{ deep: true }`;
  - `effect.vue`: `watchEffect(...)` that saves `JSON.stringify(settings.value)`.
- **Quillo** (`../app/main.qwe`): the same page; a change is `settings = set(settings, group, set(settings[group], key,
  value))`; the save is a statement, `if ready { ... }`; `onmount` reads the saved settings and sets `ready`.
  `../steps/first-try/main.qwe` reads localStorage in the state's initializer and saves with `save(settings)` from the
  start; `../steps/inplace/main.qwe` is main.qwe with the dark-mode handler written `settings.theme.dark = e.target.checked`.
  `quillo check` prints, for each: quillo: `main.qwe: ok (1 route, 1 function, 1 component)`, firsttry: `main.qwe: ok (1 route, 1 function, 1 component)`, inplace: `main.qwe: ok (1 route, 1 function, 1 component)`.

Non-blank lines: shallow 32, deep 36, effect 32, quillo 46 (the CSS, the same file on both sides, not counted).

Vue's docs, "Watchers", "Deep Watchers": "`watch` is shallow by default: the callback will only trigger when the watched
property has been assigned a new value - it won't trigger on nested property changes. If you want the callback to fire on
all nested mutations, you need to use a deep watcher"; "Deep watch requires traversing all nested properties in the
watched object, and can be expensive when used on large data structures."

## 1. Three changes and a reload (play.mjs)

`build-variants.sh` builds each Vue version for production (`vite build --outDir` a scratch folder); `vite preview
--outDir ... --port 4184` serves one at a time. Each Quillo version runs with `quillo run main.qwe --port 8184`.
`play.mjs` starts with nothing saved, wraps `localStorage.setItem` before the page loads to count every call, then ticks
Dark mode (`dark`), picks large (`large`), unticks Email me news (`changed`), and reloads (`reloaded`).

### Vue, watch(settings) (variants/shallow.vue): console: nothing

| Step | Summary | Saves on the page | setItem calls | Dark | Checkboxes | Size | localStorage |
|---|---|---|---|---|---|---|---|
| start | Light, medium text, news by email | Saved 0 times | 0 | False | [False, True] | medium | `None` |
| dark | Dark, medium text, news by email | Saved 0 times | 0 | True | [True, True] | medium | `None` |
| large | Dark, large text, news by email | Saved 0 times | 0 | True | [True, True] | large | `None` |
| changed | Dark, large text, no emails | Saved 0 times | 0 | True | [True, False] | large | `None` |
| reloaded | Light, medium text, news by email | Saved 0 times | 0 | False | [False, True] | medium | `None` |


### Vue, { deep: true } (variants/deep.vue): console: nothing

| Step | Summary | Saves on the page | setItem calls | Dark | Checkboxes | Size | localStorage |
|---|---|---|---|---|---|---|---|
| start | Light, medium text, news by email | Saved 0 times | 0 | False | [False, True] | medium | `None` |
| dark | Dark, medium text, news by email | Saved 1 times | 1 | True | [True, True] | medium | `{"theme":{"dark":true,"size":"medium"},"email":{"news":true}}` |
| large | Dark, large text, news by email | Saved 2 times | 2 | True | [True, True] | large | `{"theme":{"dark":true,"size":"large"},"email":{"news":true}}` |
| changed | Dark, large text, no emails | Saved 3 times | 3 | True | [True, False] | large | `{"theme":{"dark":true,"size":"large"},"email":{"news":false}}` |
| reloaded | Dark, large text, no emails | Saved 0 times | 3 | True | [True, False] | large | `{"theme":{"dark":true,"size":"large"},"email":{"news":false}}` |


### Vue, watchEffect (variants/effect.vue): console: nothing

| Step | Summary | Saves on the page | setItem calls | Dark | Checkboxes | Size | localStorage |
|---|---|---|---|---|---|---|---|
| start | Light, medium text, news by email | Saved 1 times | 1 | False | [False, True] | medium | `{"theme":{"dark":false,"size":"medium"},"email":{"news":true}}` |
| dark | Dark, medium text, news by email | Saved 2 times | 2 | True | [True, True] | medium | `{"theme":{"dark":true,"size":"medium"},"email":{"news":true}}` |
| large | Dark, large text, news by email | Saved 3 times | 3 | True | [True, True] | large | `{"theme":{"dark":true,"size":"large"},"email":{"news":true}}` |
| changed | Dark, large text, no emails | Saved 4 times | 4 | True | [True, False] | large | `{"theme":{"dark":true,"size":"large"},"email":{"news":false}}` |
| reloaded | Dark, large text, no emails | Saved 1 times | 5 | True | [True, False] | large | `{"theme":{"dark":true,"size":"large"},"email":{"news":false}}` |


### Quillo (../app/main.qwe): console: nothing

| Step | Summary | Saves on the page | setItem calls | Dark | Checkboxes | Size | localStorage |
|---|---|---|---|---|---|---|---|
| start | Light, medium text, news by email | Saved 1 times | 1 | False | [False, True] | medium | `{"theme":{"dark":false,"size":"medium"},"email":{"news":true}}` |
| dark | Dark, medium text, news by email | Saved 2 times | 2 | True | [True, True] | medium | `{"theme":{"dark":true,"size":"medium"},"email":{"news":true}}` |
| large | Dark, large text, news by email | Saved 3 times | 3 | True | [True, True] | large | `{"theme":{"dark":true,"size":"large"},"email":{"news":true}}` |
| changed | Dark, large text, no emails | Saved 4 times | 4 | True | [True, False] | large | `{"theme":{"dark":true,"size":"large"},"email":{"news":false}}` |
| reloaded | Dark, large text, no emails | Saved 1 times | 5 | True | [True, False] | large | `{"theme":{"dark":true,"size":"large"},"email":{"news":false}}` |


### Quillo, the first try (../steps/first-try/main.qwe): console: nothing

| Step | Summary | Saves on the page | setItem calls | Dark | Checkboxes | Size | localStorage |
|---|---|---|---|---|---|---|---|
| start | Light, medium text, news by email | Saved 2 times | 2 | False | [False, True] | medium | `{"theme":{"dark":false,"size":"medium"},"email":{"news":true}}` |
| dark | Dark, medium text, news by email | Saved 3 times | 3 | True | [True, True] | medium | `{"theme":{"dark":true,"size":"medium"},"email":{"news":true}}` |
| large | Dark, large text, news by email | Saved 4 times | 4 | True | [True, True] | large | `{"theme":{"dark":true,"size":"large"},"email":{"news":true}}` |
| changed | Dark, large text, no emails | Saved 5 times | 5 | True | [True, False] | large | `{"theme":{"dark":true,"size":"large"},"email":{"news":false}}` |
| reloaded | Light, medium text, news by email | Saved 2 times | 7 | False | [False, True] | medium | `{"theme":{"dark":false,"size":"medium"},"email":{"news":true}}` |


### Quillo, the Vue way (../steps/inplace/main.qwe): console: ['error: quillo: a map\'s fields are not set in place: write `m = set(m, "dark", …)`']

| Step | Summary | Saves on the page | setItem calls | Dark | Checkboxes | Size | localStorage |
|---|---|---|---|---|---|---|---|
| start | Light, medium text, news by email | Saved 1 times | 1 | False | [False, True] | medium | `{"theme":{"dark":false,"size":"medium"},"email":{"news":true}}` |
| dark | Light, medium text, news by email | Saved 1 times | 1 | False | [False, True] | medium | `{"theme":{"dark":false,"size":"medium"},"email":{"news":true}}` |
| large | Light, large text, news by email | Saved 2 times | 2 | False | [False, True] | large | `{"theme":{"dark":false,"size":"large"},"email":{"news":true}}` |
| changed | Light, large text, no emails | Saved 3 times | 3 | False | [False, False] | large | `{"theme":{"dark":false,"size":"large"},"email":{"news":false}}` |
| reloaded | Light, large text, no emails | Saved 1 times | 4 | False | [False, False] | large | `{"theme":{"dark":false,"size":"large"},"email":{"news":false}}` |

## 2. The starter's checks (ESLint and oxlint)

`npx eslint src/App.vue` and `npx oxlint src/App.vue`, with each version as App.vue:
- shallow: eslint exit 0, no output; oxlint exit 0, no output
- deep: eslint exit 0, no output; oxlint exit 0, no output
- effect: eslint exit 0, no output; oxlint exit 0, no output

## 3. The download

Bytes a fresh Chromium downloaded to show the page (body and headers, as sent): Vue (deep.vue, production build) 27989;
Quillo 44557.
