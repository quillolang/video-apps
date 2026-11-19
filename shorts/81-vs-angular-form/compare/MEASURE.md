# A form that checks as you type, Angular reactive forms vs Quillo: the measurements

Every number in the Short (the `versus` scene in `../video.json`) comes from a command below, with what it
printed, copied from the run. Measured on one machine; your numbers will vary.

- **When:** Thu Nov 19 14:43:24 +08 2026 (`date`, as the first command ran)
- **Machine:** Apple M5, arm64; macOS 26.7.1
- **Node:** v24.11.0; **npm:** 11.6.1
- **Angular:** @angular/cli 21.2.30, @angular/core and @angular/forms 21.2.26 (Angular 22's CLI needs Node 24.15 or
  newer; see `../../74-vs-angular-counter/compare/MEASURE.md`)
- **Quillo:** `quillo 0.8.6 (238dac2, 2026-11-16)`

KB is 1,000 bytes. The scripts that measured are in this folder: `shots-angular.mjs` (Angular's screenshots),
`measure-js.mjs` (the JavaScript) and `serve-dist.mjs` (serves Angular's build as it is). Everything ran under
`taskpolicy -b`.

## The two apps

A sign-up form: an email and an age, checked as you type. Under 13, "13 or older, please" shows; Join is off until
the email looks like one and the age is 13 or more; Join replaces the form with "Welcome, {email}!".

- **Angular** (`form/`): `ng new form --defaults` (23 files, as in 74), and a reactive form as Angular's forms guide
  writes one (https://angular.dev/guide/forms/reactive-forms, and "Validating form input"): `src/app/app.ts` has a
  `FormGroup` of two `FormControl`s with `Validators.required`, `Validators.email` and `Validators.min(13)`, and
  `joined` as a signal; `src/app/app.html` binds them with `formControlName`, shows the note on
  `hasError('min')`, and sets `[disabled]="form.invalid"` on Join. Every other file is the starter's, unchanged.
  `npx ng build` builds it with no warnings.
- **Quillo** (`../app/main.qwe`): a component with three states, `let young` and `let ok` (the email checked with a
  simple pattern, `^[^@ ]+@[^@ ]+$`, which we wrote; Angular's `Validators.email` is a fuller, tested check), and
  the form, whose inputs' `value={...}` are two-way by themselves. `quillo check` prints
  `main.qwe: ok (1 route, 0 functions, 1 component)`.

Both were used the same way in a browser, by `../shots.mjs` and `shots-angular.mjs`, which check the page's text
and whether Join is off at each step: empty (off); "ada@example.com" and age 12 (the note, off); age 14 (on);
Join (the welcome). The screenshots are from `ng serve` (port 4202) and `quillo run` (8121), 320x160 at 3x. Every
line of each file is 50 characters or less, for the Short's editor.

## Files, packages and lines

```
$ npx -y @angular/cli@21.2.30 new form --defaults --skip-git --skip-install    # whole output in new.txt
$ grep -c CREATE new.txt
23
$ npm install                          # install.txt
added 575 packages, and audited 576 packages in 3m

$ c() { grep -v '^\s*$' "$1" | grep -cv '^\s*//'; }
$ c form/src/app/app.ts; c form/src/app/app.html
25
14
$ c ../app/main.qwe
18
```

Angular: 23 files, 575 packages, 25 + 14 = 39 lines. Quillo: `quillo new hello --minimal` makes 4 files, the one
29 MB quillo binary, and 18 lines.

## JavaScript, until you've joined

`measure-js.mjs` opens the page in a fresh browser (no cache), fills in "ada@example.com" and 14, clicks Join, waits
for the welcome, and one more second for anything late; each script response and each inline `<script>` is saved
and taken with `gzip -9 -c FILE | wc -c`. Angular is its production build (`npx ng build`, served from
`dist/form/browser` by `serve-dist.mjs`); Quillo is `quillo run`. Whole outputs: `js-angular.txt`, `js-quillo.txt`.

```
$ npx ng build                         # build.txt
Initial chunk files | Names         |  Raw size | Estimated transfer size
main-ABWDS3KQ.js    | main          | 232.71 kB |                61.84 kB
...
$ node measure-js.mjs angular <out>
  the page says: Welcome, ada@example.com!
  ...
  JavaScript: 1 pieces, 232712 B raw, 69462 B gzip -9 (67.8 KiB)
$ node measure-js.mjs quillo <out>
  the page says: Welcome, ada@example.com!
  ...
  JavaScript: 4 pieces, 159855 B raw, 46233 B gzip -9 (45.1 KiB)
```

69.5 KB against 46.2 KB (Angular's has the router its starter sets up, and @angular/forms).
