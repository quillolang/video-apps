#!/bin/bash
# Builds one Svelte version for production (svelte/variants/$1.svelte copied over src/routes/+page.svelte) and
# serves it with vite preview on port $2, until stopped. adapter-auto, as the starter has it, says it found no
# production environment and builds for vite preview. Put fixed.svelte back with: ./serve-variant.sh fixed --restore
set -e
cd "$(dirname "$0")/svelte"
cp variants/$1.svelte src/routes/+page.svelte
[ "$2" = --restore ] && exit 0
npx vite build > /dev/null 2>&1
exec npx vite preview --port $2 --strictPort
