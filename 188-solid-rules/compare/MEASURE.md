# Solid 2.0 Quirks #1: what was run

Every page in the video was clicked in Chromium (Playwright's, headless) by `../shots.mjs`, which keeps what each page showed, and what
the browser's console said, in `../assets/runs.json`; `../make-video.py` checks the narration against it. Run on one machine.

- **When:** Fri Nov 20 2026 20:17:11 GMT+0800 (Singapore Standard Time)
- **Machine:** Apple M5, 16 GB; macOS 26.7.1 (25G241)
- **Node:** v24.11.0
- **solid-js and @solidjs/web:** 2.0.3; **@solidjs/vite-plugin:** 3.0.1; **Vite:** 8.3.8; **oxlint:** 1.92.0; **eslint-plugin-solid:** 0.20.0
- **Quillo:** `quillo 0.8.8 (f35bf2d, 2026-11-19)`

## The apps

- **Solid** (`solid/`): Solid's own starter, `npm create solid@0.13.0 -- -p solid --solid -t bare --js --no-devtools` (create-solid 0.13.0, a
  Solid 2.0 project), then `npm install`. Each quirk is a file in `src/` with its fix beside it (`Score.jsx`, `ScoreFixed.jsx`, ...);
  `App.jsx` shows one by the address's hash (`#score`, `#score-fixed`); `App.css` is the shared styles (`../app/quirks.css`); the
  title in `Document.jsx` is "Solid Quirks"; the starter's logo.svg is removed. Run as `npm run dev` runs it: `vite` on 3000, with the
  starter's `solid({ start: true, diagnostics: true })`. The production build: `npx vite build`, then `npx vite preview` on 4173.
- **Quillo** (`../app/main.qwe`): the same five pages, at `/score` and so on, run with `./run.sh --watch` on 8080.

## What each page showed

| Page | Solid, as written (npm run dev) | Solid, fixed | Solid, as written (production) | Quillo |
|---|---|---|---|---|
| Score (+2, one click) | Score / 1 / +2 | Score / 2 / +2 | Score / 1 / +2 | Score / 2 / +2 |
| Likes (Like, three clicks) | Likes / 0 / Like | Likes / 3 / Like | Likes / 0 / Like | Likes / 3 / Like |
| Tickets (One more, two clicks) | (a blank page) | Tickets / 3 × $5 / $15 / One more | (a blank page) | Tickets / 3 × $5 / $15 / One more |
| Groceries (Add eggs) | Groceries / milk / bread / Add eggs | Groceries / milk / bread / eggs / Add eggs | Groceries / milk / bread / Add eggs | Groceries / milk / bread / eggs / Add eggs |
| Note (two clicks) | Note / Editing… / Ran: edit, edit / Save | Note / Saved / Ran: edit, save / Edit | Note / Editing… / Ran: edit, edit / Save | Note / Saved / Ran: edit, save / Edit |

## The browser's console (npm run dev)

Warnings and errors, first lines (the full text is in runs.json). The fixed pages logged nothing; Score logged nothing.

**likes:**

```
[warning] [LOWERCASE_EVENT_ATTRIBUTE] `onclick` received a function, but `onclick` is an attribute in Solid 2.0, not an event handler: the function was set as the attribute's text. Use `onClick` for event handlers.
```

**tickets:**

```
[error] [REACTIVITY_HALTED] An uncaught error halted the reactive system. No further updates will be processed. Handle errors with <Errored> or treat this as a crash.
[pageerror] [MISSING_EFFECT_FN] createEffect requires both a compute function and an effect function. Use `createEffect(() => signal(), value => doWork(value))`. If you want a derived value, use `createMemo`. If you want a one-shot side effect, just call the function directly.
[warning] [MISSING_EFFECT_FN] what it means and how to fix it: https://docs.solidjs.com/reference/solid-js/diagnostics/missing-effect-fn
[warning] [REACTIVITY_HALTED] what it means and how to fix it: https://docs.solidjs.com/reference/solid-js/diagnostics/reactivity-halted
[pageerror] [MISSING_EFFECT_FN] createEffect requires both a compute function and an effect function. Use `createEffect(() => signal(), value => doWork(value))`. If you want a derived value, use `createMemo`. If you want a one-shot side effect, just call the function directly.
```

**groceries:**

```
[warning] [STORE_WRITE_OUTSIDE_SETTER] Writing store property "2" outside its setter was ignored. Stores are read-only outside the setter's draft: use `setStore(s => { s[2] = value })`.
[warning] [STORE_WRITE_OUTSIDE_SETTER] Writing store property "length" outside its setter was ignored. Stores are read-only outside the setter's draft: use `setStore(s => { s.length = value })`.
```

**note:**

```
[warning] [STRICT_READ_UNTRACKED] Reactive value "editing" read in an event handler expression. Event handlers are not reactive: read the value inside the handler function instead.
```

In the production build, only Tickets logged anything:

```
[error] TypeError: Cannot read properties of undefined (reading 'effect')
```

## The checkers

`quillo check main.qwe`: `main.qwe: ok (6 routes, 1 function, 5 components)`. With `items.push("eggs")` in place of `items = items | push("eggs")` (line 51):

```
main.qwe:51: warning: `push` gives a new value and changes nothing, and it is dropped here: write `items = items | push(...)`
main.qwe: ok (6 routes, 1 function, 5 components), 1 warning
```

`npm run lint` in `solid/` (the starter's own script, `oxlint src`):

```
> example-bare@0.0.0 lint
> oxlint src

src/Groceries.jsx:4:16: warning eslint(no-unused-vars): Variable 'setList' is declared but never used. Unused variables should start with a '_'. help: Consider removing this declaration.
```

The starter's `oxlint.config.js` loads eslint-plugin-solid's v2 rules, but `oxlint src` did not read it here (oxlint 1.92 looks for
`.oxlintrc.json` unless `-c` names a config; its help says JavaScript configs are experimental). With the config named,
`npx oxlint -c oxlint.config.js src`:

```
src/Likes.jsx:10:15: error solid(event-handlers): In Solid 2.0, onclick is a literal attribute, not an event handler — this listener will never fire. Rename it to onClick.
src/Groceries.jsx:4:16: warning eslint(no-unused-vars): Variable 'setList' is declared but never used. Unused variables should start with a '_'. help: Consider removing this declaration.
src/Groceries.jsx:4:16: warning solid(no-unused-signal): This store is never written, so its value can never change. Use a plain value, or `createMemo` if it should derive from reactive state.
src/Groceries.jsx:12:30: error solid(no-store-mutation-outside-setter): 'list' is a store's read proxy, which is read-only; this mutation is silently ignored — no error, no update, the write just vanishes. Mutate the draft inside the setter instead: `setList(draft => { ... })`.
src/Tickets.jsx:7:3: error solid(no-single-arg-create-effect): In Solid 2.0, createEffect takes separate compute and effect functions: `createEffect(() => signal(), (value) => doWork(value))`. For a derived value use `createMemo`; for a one-shot side effect, just call the function directly.
src/Note.jsx:15:24: warning solid(reactivity): The reactive variable 'editing' should be wrapped in a function for reactivity. This includes event handler bindings on native elements, which are not reactive like other JSX props.
```
