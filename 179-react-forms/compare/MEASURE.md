# React Quirks #2: what was run

Every page in the video was typed into and clicked in Chromium (Playwright's, headless) by `../shots.mjs`, which keeps what each
page showed and held in its fields in `../assets/runs.json`; `../make-video.py` checks the narration against it. Run on one machine.

- **When:** Fri Nov 20 2026 17:25:44 GMT+0800 (Singapore Standard Time)
- **Machine:** Apple M5, 16 GB; macOS 26.7.1 (25G241)
- **Node:** v24.11.0
- **React and react-dom:** 19.3.1; **Vite:** 8.3.8; **oxlint:** 1.94.0
- **Quillo:** `quillo 0.8.8 (f35bf2d, 2026-11-19)`

## The apps

- **React** (`react/`): Vite's own starter, `npm create vite@9.3.4 react -- --template react --no-interactive --no-immediate`, then
  `npm install`. Each quirk is a file in `src/` with its fix beside it (`Guests.jsx`, `GuestsFixed.jsx`, ...); `App.jsx` shows one by
  the address's hash (`#guests`, `#guests-fixed`); `index.css` is the shared styles (`../quirks.css`); the title is "React Quirks". The
  starter's `main.jsx`, with StrictMode, is as it was. Run as `npm run dev` runs it: `vite` on 5173.
- **Quillo** (`../main.qwe`): the same five pages, at `/guests` and so on, run with `./run.sh --watch` on 8080.

## What each page showed

| Page | React, as written | React, fixed | Quillo |
|---|---|---|---|
| Guests (up arrow on Kids) | Guests / Adults / Kids / 21 guests; fields: '2', '1' | Guests / Adults / Kids / 3 guests; fields: '2', '1' | Guests / Adults / Kids / 3 guests; fields: '2', '1' |
| Your name (type "stasia") | Your name / Hi, Ana!; fields: 'Ana' | Your name / Hi, Anastasia!; fields: 'Anastasia' | Your name / Hi, Anastasia!; fields: 'Anastasia' |
| Notes ("Call Ana", Enter) | Notes / Buy milk; fields: '' | Notes / Buy milk / Call Ana; fields: 'Call Ana' | Notes / Buy milk / Call Ana; fields: 'Call Ana' |
| Sign up (an email with no @) | Sign up / Sign up / That email needs an @; fields: '', '' | Sign up / Sign up / That email needs an @; fields: 'Ana', 'ana.example.com' | Sign up / Sign up / That email needs an @; fields: 'Ana', 'ana.example.com' |
| Coupon code ("ab" after "HE") | Coupon code / Your code: HEALLOB; fields: 'HEALLOB' | Coupon code / Your code: HEABLLO; fields: 'HEABLLO' | Coupon code / Your code: HEABLLO; fields: 'HEABLLO' |

After Enter, React's Notes page was at `/?note=Call+Ana#notes`: the browser had sent the form and loaded the page again.

React's console, on the Name page: `You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`.`

## The checkers

`quillo check main.qwe`: `main.qwe: ok (6 routes, 1 function, 5 components)`

`npm run lint` in `react/` (the starter's oxlint, its own settings):

```
> react@0.0.0 lint
> oxlint

src/Name.jsx:4:16: warning eslint(no-unused-vars): Variable 'setName' is declared but never used. Unused variables should start with a '_'. help: Consider removing this declaration.
```
