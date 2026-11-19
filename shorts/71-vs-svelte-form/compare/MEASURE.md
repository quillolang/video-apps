# A form that checks its input, SvelteKit form actions vs a typed Quillo route: the measurements

Every number and answer in the Short (the terminals and the `versus` scene in `../video.json`) comes from a
command below, with what it printed, copied from the run. Measured on one machine; your numbers will vary.

- **When:** Thu Nov 19 13:35:30 +08 2026 (`date`, as the first command ran)
- **Machine:** Apple M5, arm64; macOS 26.7.1
- **Node:** v24.11.0 (`node -v`); **npm:** 11.6.1 (`npm -v`)
- **sv:** 1.5.0; **SvelteKit:** 3.4.0; **Svelte:** 5.58.0; **Vite:** 8.3.8 (as in `../../64-vs-svelte-counter`)
- **Quillo:** `quillo 0.8.6 (238dac2, 2026-11-16)` (`.quillo/bin/quillo --version`)

The scripts that measured are in this folder: `ages.sh` (the seven ages) and `shots-svelte.mjs` (SvelteKit's
screenshots). Everything ran under `taskpolicy -b`.

## The two apps

A sign-up form: an email, and an age that must be a whole number, 13 or older. A wrong age gets the form back
with a message and the email kept, and status 400; a right one gets "Welcome, ada@example.com!".

- **SvelteKit** (`svelte/`): `npx sv create` with the minimal template and TypeScript, and a default form action
  as SvelteKit's docs show it (https://svelte.dev/docs/kit/form-actions, "Validation errors"): `request.formData()`,
  `fail(400, { email, ... })` and `form?.email` back in the input. `src/routes/+page.server.ts` turns the age into a
  number with `Number(...)` and checks it with `Number.isInteger` and `< 13`; `src/routes/+page.svelte` shows the
  message and the form, or the welcome. `npm run check` prints `COMPLETED 173 FILES 0 ERRORS 0 WARNINGS`.
- **Quillo** (`../app/main.qwe`): a view for the page, and two `POST /` routes: one whose pattern,
  `{ form: { email: str, age: int } }`, makes the age an int (and doesn't match when it isn't one), and one for
  anything else. `quillo check` prints `main.qwe: ok (3 routes, 1 function, 0 components)`.

Every line of each file is 50 characters or less, to fit the Short's editor (SvelteKit's in two spaces rather
than the starter's tabs, which the editor draws 8 wide).

## In a browser

`../shots.mjs` and `shots-svelte.mjs` open each form (320x160 at 3x), send it with age 12, check that the page
says "You must be 13 or older" with the email kept, then send it with 14 and check for the welcome. Both pass.
The screenshots are from `npm run dev` (port 5177) and `quillo run` (8115). The browser's `type="number"` box
stops "abc" and "0x0E" before they're sent; a script, or anything else that posts the form, doesn't.

## The seven ages

`ages.sh` posts the form with curl, as a browser does with JavaScript off: with its `Origin` header (without it,
SvelteKit refuses a form post as cross-site) and `Accept: text/html` (with curl's `*/*`, SvelteKit answers with
JSON, as it does for `use:enhance`). Each server was started for its run and stopped after it.

```
$ ./ages.sh http://localhost:5177           # SvelteKit, npx vite dev --port 5177
"14"    200  Welcome, ada@example.com!
"12"    400  You must be 13 or older
"abc"   400  Age must be a whole number
"0x0E"  200  Welcome, ada@example.com!
"1e1"   400  You must be 13 or older
"02"    400  You must be 13 or older
""      400  You must be 13 or older

$ ./ages.sh http://127.0.0.1:8115           # Quillo, quillo run main.qwe --port 8115
"14"    200  Welcome, ada@example.com!
"12"    400  You must be 13 or older
"abc"   400  Age must be a whole number
"0x0E"  400  Age must be a whole number
"1e1"   400  Age must be a whole number
"02"    400  Age must be a whole number
""      400  Age must be a whole number
```

(Saved as `ages-svelte.txt` and `ages-quillo.txt`.) JavaScript's `Number("0x0E")` is 14, `Number("1e1")` is 10,
`Number("")` is 0 and `Number("02")` is 2, all whole numbers, so SvelteKit's action welcomes "0x0E" and calls the
others too young. Quillo's `int` in a route pattern takes only plain whole numbers: no hex, exponent or empty,
and no leading zero either, so "02" is refused as not a whole number,
where SvelteKit reads it as 2.

## Lines, and what you install

```
$ c() { grep -v '^\s*$' "$1" | grep -cv '^\s*//'; }
$ c svelte/src/routes/+page.server.ts; c svelte/src/routes/+page.svelte
16
20
$ c ../app/main.qwe
19
$ npm install                               # in svelte/; whole output in install.txt
added 86 packages, and audited 87 packages in 18s
```

SvelteKit: 16 + 20 = 36 lines, and 86 npm packages (with Node first). Quillo: 19 lines, and the one quillo
binary, 29 MB.
