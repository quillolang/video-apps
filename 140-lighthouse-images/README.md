# Images That Jump: Layout Shift (CLS) in SvelteKit vs Quillo, Measured With Lighthouse

Hearth Bakery's journal, in Quillo (main.qwe, on 8080): four photos, each <img> with the photo's own width and height, read with image.info, and an 800-pixel copy of each made with image.convert as the server starts, so the page keeps each photo's place while it loads. steps/plain is the first version, without sizes. compare/svelte is the same page in SvelteKit 3.3.1 from the official starter, with @sveltejs/enhanced-img 1.0.1 (<enhanced:img>); variants/plain/+page.svelte is its version without sizes. compare/lh runs Lighthouse 13.6.0 on each pair, with its default simulated throttling and with applied throttling; compare/filmstrip.mjs records each loading on a slowed network and CPU, with its layout shifts. compare/MEASURE.md has every command and what it printed.

Written for Quillo 0.8.6 (get it at https://quillolang.org). Run it with:

```sh
./run.sh                                     # Quillo's journal, on 8080
(cd steps/plain && ./run.sh --port 8081)     # the first version, without sizes
(cd compare && ./build-variants.sh /tmp/journal)   # SvelteKit's two, then: cd /tmp/journal/enhanced && npx vite preview --port 4181
(cd compare/lh && npm install && node run.mjs svelte_enhanced=http://localhost:4181/ quillo_sized=http://localhost:8080/ --applied)
# Windows (PowerShell), with Quillo from quillolang.org: quillo run main.qwe
```

## The versions in the video

The first version from the video, a folder that runs on its own (`cd steps/plain && ./run.sh --port 8081`):

- [`steps/plain`](steps/plain): the first version: plain <img> tags with no width or height, so the text jumps as each photo's size arrives
- this folder: the finished app

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
