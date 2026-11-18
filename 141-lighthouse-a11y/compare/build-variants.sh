#!/bin/bash
# Builds each Vue version of the bakery's order form for production, each in its own copy under <dir>, and runs the
# starter's own lint on it (npm run lint: oxlint, then ESLint with eslint-plugin-vue), its output kept in lint.log:
#   broken  variants/broken/App.vue and variants/broken/index.html (the starter's <html lang="">): no labels, no alt
#           text, an icon for a button and for a link, and a light grey note
#   fixed   vue/ as it is
#   ./build-variants.sh <dir>     then: cd <dir>/<version> && npx vite preview --port 4191
set -e
cd "$(dirname "$0")/vue"
for v in broken fixed; do
	d="$1/$v"
	rm -rf "$d"
	mkdir -p "$d"
	cp -R src public index.html package.json vite.config.js jsconfig.json eslint.config.js .oxlintrc.json .gitignore "$d/"
	ln -s "$PWD/node_modules" "$d/node_modules"
	if [ $v = broken ]; then
		cp variants/broken/App.vue "$d/src/App.vue"
		cp variants/broken/index.html "$d/index.html"
	fi
	(cd "$d" && npm run lint > lint.log 2>&1 && npx vite build > build.log 2>&1)
done
