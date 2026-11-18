#!/bin/sh
# measure.mjs on every version, as shots.mjs serves them: the React builds (vite preview) on 4173 to 4177
# and Quillo on 8080; with ROWS=10000, the 10,000-product builds on 4183 to 4187 and Quillo on 8180.
cd "$(dirname "$0")"
if [ "${ROWS:-1000}" = 10000 ]; then p=418; q=8180; else p=417; q=8080; fi
exec node measure.mjs react=http://localhost:${p}3 memo=http://localhost:${p}4 memo+useCallback=http://localhost:${p}5 \
  compiler=http://localhost:${p}6 compiler+updater=http://localhost:${p}7 quillo=http://localhost:$q "$@"
