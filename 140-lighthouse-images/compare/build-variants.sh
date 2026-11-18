#!/bin/bash
# Builds each SvelteKit version of the bakery's journal for production, each in its own copy under <dir>:
#   enhanced  svelte/ as it is: the photos in src/lib/photos/, shown with <enhanced:img> (@sveltejs/enhanced-img)
#   plain     the same app, with variants/plain/+page.svelte for its page: the photos in static/photos/, shown with
#             a plain <img>, as a file in static/ is
# adapter-auto, as the starter has it, says it found no production environment and builds for vite preview:
#   ./build-variants.sh <dir>     then: cd <dir>/<version> && npx vite preview --port 4181
set -e
cd "$(dirname "$0")/svelte"
for v in plain enhanced; do
	d="$1/$v"
	rm -rf "$d"
	mkdir -p "$d"
	cp -R src static package.json vite.config.js jsconfig.json "$d/"
	ln -s "$PWD/node_modules" "$d/node_modules"
	if [ $v = plain ]; then
		cp variants/plain/+page.svelte "$d/src/routes/+page.svelte"
		mkdir -p "$d/static/photos"
		cp src/lib/photos/*.jpg "$d/static/photos/"
	fi
	(cd "$d" && npx vite build > build.log 2>&1)
done
