#!/bin/bash
# Builds each version of the sign-up route handler for production, each into its own folder (next.config.mjs's distDir):
#   naive  variants/naive.js: request.json(), saved as it came, as the route.js docs read a body
#   zod    variants/zod.js: a zod schema, safeParse, and a 400 with z.flattenError, as the docs suggest for server-side
#          validation (app/api/signups/route.js is left as this one)
# Then run one with: cd next && DIST=.next/zod npx next start -p 3102
set -e
cd "$(dirname "$0")/next"
for v in naive zod; do
	cp variants/$v.js app/api/signups/route.js
	mkdir -p .next
	DIST=.next/$v npx next build > .next/build-$v.log 2>&1
done
