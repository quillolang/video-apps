# How the ten pages were made and played

Run 2026-11-25 on an Apple M5 (macOS 26.7.1), Node 24.11.0, Python 3.13 (uv venv), rustc 1.99.0, Chromium (Playwright).

## The page

One page, five boxes (shared/page.css styles all but Streamlit's): **Details** (a button whose label says Show or Hide,
and a paragraph only while open), **Status** (three buttons; Loading…, Couldn't load or 3 messages), **Unread** (+1 unread,
Read all, and a badge "N new" only when N > 0), **Log in or sign up** (a button that switches between an input "Your email"
and an input "Work email"), and **Counter** (a Counter component with its own count, shown or removed by a button).

| Folder | Framework | Made from | Served for the runs |
|---|---|---|---|
| `react/` | React 19.3.1, Vite 8.3.8 | videos/208's `npm create vite@9.3.4 -- --template react` project, src/ rewritten | `npx vite build`, dist/ by serve.mjs |
| `vue/` | Vue 3.5.46 | 208's `npm create vue@3.24.0 -- --eslint` project | the same |
| `svelte/` | Svelte 5.59.1 | 208's Vite Svelte project | the same |
| `solid/` | Solid 2.0.3 | 208's `npm create solid@0.13.0` bare project | dist/client |
| `reflex/` | Reflex 0.11.0 | `reflex init --name inbox --template blank` | `reflex run --env prod` |
| `nicegui/` | NiceGUI 4.1.0 | by hand, from its docs | `python main.py` |
| `streamlit/` | Streamlit 1.67.0 | by hand, from its docs | `streamlit run app.py` |
| `leptos/` | Leptos 0.8.23 (csr) | Cargo.toml + index.html for trunk 0.22.2 | `trunk build --release` (build-rust.sh) |
| `dioxus/` | Dioxus 0.7.10 | 208's `dx new` project, src rewritten | `dx build --release --platform web` |
| `../app/` | Quillo 0.8.11 | `main.qwe` | `quillo run` |

The Python ones: `uv venv -p 3.13 .venv && uv pip install -p .venv/bin/python nicegui streamlit reflex`.

## Played

`node run.mjs <name> <url>` opens the page at 1000x700 and, by each control's role and name: opens and closes the details;
clicks Error, Ready, Loading; reads the badge at 0, at 1, and after Read all; types ana@mail.com in the email field, switches
to sign-up and reads the field there, and back; clicks +1 twice, hides the counter and shows it. It writes what each box
said at each step to runs/<name>.json (runs/shots-<name>.json are the same runs that took the video's screenshots).

## The mistakes

mistakes.json holds each as edits to one app; `node make.mjs [round ...] [--only=...]` copies the app into build/,
applies them, runs the starter's linter (React: oxlint; Vue: eslint; Solid: oxlint with eslint-plugin-solid's rules), the
build (Svelte's compiler warnings are in it; Rust's errors), `quillo check`, and plays the round's box on the production
build and, for the Vite apps, on the dev server too. runs/variants.json has every command's output and what the page showed.

- **zero**: the badge as `unread && ...` (each one's way to write it), at 0.
- **zeroshow**: Solid's `<Show when={unread()}>` (an extra: Show treats 0 as false).
- **once**: the button's label worked out once, outside the reactive place; React's version is a hook inside an `if`,
  Streamlit's `if st.button(...)`, Quillo's a `state` assigned on its own line.
- **keep**: a hidden counter kept: React's `<Activity>`, Vue's `v-show`, the `hidden` attribute in the others.

Quillo issues found while making it went to quillo-app1's feedback (FEEDBACK90: Q-1400, Q-1401; Q-1361 seen again).
