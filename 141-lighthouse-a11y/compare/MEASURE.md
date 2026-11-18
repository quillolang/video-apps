# The accessibility audit, a Vue form and a Quillo form: the measurements

Every result in the video comes from the runs below, copied from the run. `../shots.mjs` runs them and keeps the results
in `../assets/runs.json`. Measured on one machine.

- **When:** Wed Nov 18 2026 21:31:30 GMT+0800 (Singapore Standard Time) (as shots.mjs started)
- **Machine:** Apple M5, 16 GB, arm64; macOS 26.7.1 (25G241)
- **Node:** v24.11.0; **npm:** 11.6.1
- **create-vue:** 3.24.0; **Vue:** 3.5.45; **Vite:** 8.3.8; **ESLint:** 10.15.0; **eslint-plugin-vue:** 10.11.1; **oxlint:** 1.82.0
- **eslint-plugin-vuejs-accessibility:** 2.6.3 (in `a11y-lint/`, with ESLint 10.15.0 and eslint-plugin-vue 10.12.1)
- **Lighthouse:** 13.6.0, with chrome-launcher, in Playwright's Chromium
- **Quillo:** `quillo 0.8.6 (238dac2, 2026-11-16)` (each folder's own, from its get-quillo.sh)

## The forms

Hearth Bakery's order form: a logo and a heading, a name, an email, a loaf (a select), how many (a number), a note,
a button, and a link to the bakery's page in the footer. The same styles in each (`../app/order.css`, and
`vue/src/order.css`, the same file). Each form works: filled in with Ana, ana@example.com, Seeded and 2, and sent, each
shows "Thanks, Ana! Your 2 × Seeded will be ready at 7."

As first written (the usual mistakes): placeholders for the name and the email, no label anywhere, a logo without
`alt`, a button with only an arrow icon in it, a link with only a map pin icon, and the note in a light grey
(`#b5aca3` on white). Fixed: each field inside a `<label>` with its words, `alt="Hearth Bakery"`, the words "Order" in
the button and "Visit the bakery" in the link, and the note in `#6b5a48`.

- **Vue** (`vue/`): the official starter, `npm create vue@latest -- --eslint --bare vue` (create-vue 3.24.0: oxlint, then
  ESLint with eslint-plugin-vue's `flat/essential` rules). `variants/broken/App.vue` (37 non-blank lines) and
  `variants/broken/index.html` (the starter's own `<html lang="">`, with the title and description changed) are the
  first version; `src/App.vue` (43 lines) and `index.html` (`lang="en"`) the fixed one. `src/main.js` imports
  `order.css`; the logo is `public/logo.png`.
- **Quillo**: `../steps/broken/main.qwe` (39 lines) the first version, `../app/main.qwe` (40 lines) the fixed one; both
  `<html lang="en">`, the icons as views, the form posted to `route POST /order { form: { name: str, email: str, loaf:
  str, count: int } }`.

`build-variants.sh <dir>` builds both Vue versions for production in their own copies and runs the starter's `npm run
lint` in each first (each copy has the starter's `.gitignore`, which is what keeps oxlint out of `node_modules`).
shots.mjs serves them with `vite preview` (broken on 4191, fixed on 4192), and runs Quillo's with `quillo run main.qwe`
(steps/broken on 8081, app on 8080).

## Before the browser: the linters

`npm run lint`, in the broken copy (oxlint and ESLint print nothing when they find nothing):

```
> vue@0.0.0 lint
> run-s "lint:*"


> vue@0.0.0 lint:oxlint
> oxlint . --fix


> vue@0.0.0 lint:eslint
> eslint . --fix --cache
```

The same in the fixed copy. `quillo check main.qwe` prints `main.qwe: ok (4 routes, 3 functions, 0 components)` for
both Quillo versions.

## Lighthouse's accessibility audit (lh/a11y.mjs)

`lh/a11y.mjs` runs Lighthouse (its phone settings) with only the accessibility category, once per page (the audit reads
the page as it stands once loaded, and doesn't vary), and prints the score and each audit that failed, with how many
elements it found. The broken pair:

```
vue_broken: accessibility 40
  button-name (1)
  color-contrast (1)
  html-has-lang (1)
  image-alt (1)
  label (1)
  link-name (1)
  select-name (1)
quillo_broken: accessibility 50
  button-name (1)
  color-contrast (1)
  image-alt (1)
  label (1)
  link-name (1)
  select-name (1)
```

The elements: `<button>`, the note's `<p>`, `<html lang="">` (Vue only), the `<img>`, the number `<input>` (the two
inputs with placeholders passed `label`: a placeholder counts as a name), the `<a href="/visit">`, the `<select>`.
The fixed pair:

```
vue_fixed: accessibility 100
quillo_fixed: accessibility 100
```

Lighthouse's own description of the category: "These checks highlight opportunities to improve the accessibility of
your web app. Automatic detection can only detect a subset of issues and does not guarantee the accessibility of your
web app, so manual testing is also encouraged." It lists 10 more items to check by hand ("These items address areas
which an automated testing tool cannot cover").

## What a screen reader is told (aria.mjs)

`aria.mjs` prints the page's accessibility tree, as Playwright's ARIA snapshot gives it. Shown here, as in the video,
with `| grep -v -e '- option' -e '/url' -e '- text:'` (without the select's options, the link's address, and the
labels' own text). Vue's and Quillo's are the same, line for line. Broken:

```
- banner:
  - img
  - heading "Order for tomorrow" [level=1]
- main:
  - textbox "Your name"
  - textbox "Email"
  - combobox:
  - spinbutton: "1"
  - paragraph: Order by 9 pm, and collect it from 7 am.
  - button:
    - img
- contentinfo:
  - link:
    - img
```

Fixed:

```
- banner:
  - img "Hearth Bakery"
  - heading "Order for tomorrow" [level=1]
- main:
  - textbox "Your name"
  - textbox "Email"
  - combobox "Loaf":
  - spinbutton "How many": "1"
  - paragraph: Order by 9 pm, and collect it from 7 am.
  - button "Order":
    - img
- contentinfo:
  - link "Visit the bakery":
    - img
```

## Vue's community accessibility lint (a11y-lint/)

`a11y-lint/eslint.config.js`: eslint-plugin-vue's `flat/essential` rules (the starter's) and
eslint-plugin-vuejs-accessibility's `flat/recommended`. It's a community plugin (vue-a11y), not in create-vue's starter.
shots.mjs copies both App.vue files into `a11y-lint/broken/` and `a11y-lint/fixed/` and runs:

```
$ npx eslint -f json broken/App.vue | jq -r '.[].messages[] | "\(.line) \(.ruleId)"'
15 vuejs-accessibility/alt-text
21 vuejs-accessibility/form-control-has-label
22 vuejs-accessibility/form-control-has-label
25 vuejs-accessibility/form-control-has-label
33 vuejs-accessibility/anchor-has-content
$ npx eslint -f json fixed/App.vue | jq -r '.[].messages[] | "\(.line) \(.ruleId)"'
21 vuejs-accessibility/label-has-for
22 vuejs-accessibility/label-has-for
23 vuejs-accessibility/label-has-for
29 vuejs-accessibility/label-has-for
```

On the broken form: line 15 is the logo, 21 the email, 22 the select, 25 the number, 33 the link. Its
`form-control-has-label` skips an `<input>` with no `type` attribute (the name box, line 20); nothing in its recommended
rules looked at the button's name, the note's contrast, or index.html's `lang`. On the fixed form, `label-has-for`
defaults to `required: { every: ["nesting", "id"] }`: each label must both wrap its field and name it with `for` and
`id`, so the four wrapping labels are errors (both read from the plugin's source, `dist/rules/`).

Quillo has no accessibility check: `quillo check` passes a page with all of these mistakes without a warning.
