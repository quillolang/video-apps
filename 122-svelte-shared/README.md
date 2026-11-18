# Svelte 5: Two Errors You'll Meet Sharing State Between Files (and How Quillo Shares It)

Book Club: the books on my list, shared by a count in the header, an Add button on every book and a list beside them, in Quillo (main.qwe, on 8080): `state picks = []` at the top of the program is the page's, and a plain function, pages(), works out the pages. compare/svelte is the same app in Svelte 5.57.3 with SvelteKit 3.3.1, from Svelte's own starter, with the shared state in src/lib/list.svelte.js, three ways (variants/: reassign, `export let picks = $state([])` reassigned, which the compiler refuses; derived, an object changed in place with the pages exported as $derived, which it also refuses; fixed, the pages as a function). compare/use-variant.sh puts one in place; compare/MEASURE.md has every command and what it printed.

Written for Quillo 0.8.6 (get it at https://quillolang.org). Run it with:

```sh
./run.sh                                     # Quillo's Book Club, on 8080
(cd compare/svelte && npm install && npm run dev)  # Svelte's (src/lib holds the fixed version)
(cd compare && ./use-variant.sh reassign && cd svelte && npm run build)   # a trap, refused
```

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
