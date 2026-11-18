#!/bin/bash
# Builds one SvelteKit version for production and serves it with vite preview on port $2, until stopped:
#   stale  load and form actions, as the starter's docs have them (variants/stale.svelte, +page.server.js)
#   poll   the same, and refreshAll every 2 seconds (variants/poll.svelte)
#   live   query.live, experimental, in groceries.remote.js (variants/live/: the page, db.js, the actions, vite.config.js)
# adapter-auto, as the starter has it, says it found no production environment and builds for vite preview.
# Put the stale version back with: ./serve-variant.sh stale --restore
set -e
cd "$(dirname "$0")/svelte"
rm -f src/routes/groceries.remote.js
if [ "$1" = live ]; then
	cp variants/live/+page.svelte variants/live/+page.server.js variants/live/groceries.remote.js src/routes/
	cp variants/live/db.js src/lib/server/db.js
	cp variants/live/vite.config.js vite.config.js
else
	cp variants/$1.svelte src/routes/+page.svelte
	cp variants/classic/+page.server.js src/routes/+page.server.js
	cp variants/classic/db.js src/lib/server/db.js
	cp variants/classic/vite.config.js vite.config.js
fi
[ "$2" = --restore ] && exit 0
npx vite build > /dev/null 2>&1
exec npx vite preview --port $2 --strictPort
