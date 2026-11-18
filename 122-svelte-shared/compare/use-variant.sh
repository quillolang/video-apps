#!/bin/bash
# Puts one Svelte version into the starter: svelte/variants/<version>/ (list.svelte.js, Header.svelte, BookCard.svelte,
# MyList.svelte) into src/lib/, with variants/books.js, and variants/page.svelte as src/routes/+page.svelte.
#   ./use-variant.sh fixed
set -e
cd "$(dirname "$0")/svelte"
cp variants/$1/* src/lib/
cp variants/books.js src/lib/books.js
cp variants/page.svelte src/routes/+page.svelte
