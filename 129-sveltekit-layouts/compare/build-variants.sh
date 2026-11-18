#!/bin/bash
# Builds each SvelteKit version of the Trail Guide for production, each in its own copy under <dir>:
#   section  svelte/src as it is: a layout, the pages, a matcher, a root error page and one for the trails section
#   rest     the same, and the route SvelteKit's docs give for a section's own 404s (variants/rest/+page.js, put
#            in src/routes/trails/[...rest]/)
# adapter-auto, as the starter has it, says it found no production environment and builds for vite preview:
#   ./build-variants.sh <dir>     then: cd <dir>/<version> && npx vite preview --port 4181
set -e
cd "$(dirname "$0")/svelte"
for v in section rest; do
	d="$1/$v"
	mkdir -p "$d"
	cp -R src static package.json vite.config.js jsconfig.json "$d/"
	ln -s "$PWD/node_modules" "$d/node_modules"
	if [ $v = rest ]; then
		mkdir -p "$d/src/routes/trails/[...rest]"
		cp variants/rest/+page.js "$d/src/routes/trails/[...rest]/+page.js"
	fi
	(cd "$d" && npx vite build > build.log 2>&1)
done
