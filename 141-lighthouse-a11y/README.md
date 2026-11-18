# The Accessibility Audit: a Vue Form vs a Quillo Form, Under Lighthouse (and What the Linters Miss)

Hearth Bakery's order form, in Quillo (main.qwe, on 8080): every field with a label, the logo with alt text, the button and the link with words of their own, and the note dark enough to read; Lighthouse 13.6.0's accessibility audit gives it 100. steps/broken is the first version, with the usual mistakes (50). compare/vue is the same form in Vue 3.5.45, from create-vue's starter with ESLint; variants/broken is its first version (40, with the starter's empty lang). compare/lh/a11y.mjs runs the audit; compare/aria.mjs prints what a screen reader is told (Playwright's ARIA snapshot); compare/a11y-lint lints the Vue forms with the community plugin eslint-plugin-vuejs-accessibility 2.6.3. compare/MEASURE.md has every command and what it printed.

Written for Quillo 0.8.6 (get it at https://quillolang.org). Run it with:

```sh
./run.sh                                     # Quillo's form, on 8080
(cd compare/vue && npm install && npm run build && npx vite preview)   # Vue's, on 4173
(cd compare/lh && npm install && node a11y.mjs vue=http://localhost:4173/ quillo=http://localhost:8080/)
# Windows (PowerShell), with Quillo from quillolang.org: quillo run main.qwe
```

## The versions in the video

The first version from the video, a folder that runs on its own (`cd steps/broken && ./run.sh --port 8081`):

- [`steps/broken`](steps/broken): the first version: placeholders for labels, a logo without alt text, an icon for a button and for a link, and a light grey note
- this folder: the finished app

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
