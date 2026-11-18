#!/bin/bash
# Each Vue version through the starters' own checks: ESLint as `npm create vue -- --eslint` set it up (vue/), and
# vue-tsc as `npm create vue -- --ts` set it up (vue-ts/, the same file with lang="ts" and a type for team). Each
# file is copied over src/App.vue in turn (an App.vue is what the starter lints), and fixed.vue put back.
cd "$(dirname "$0")"
for v in destructure value reassign; do
  echo "== $v.vue"
  cp vue/variants/$v.vue vue/src/App.vue
  out=$(cd vue && npx eslint src/App.vue 2>&1 | grep -E '^ +[0-9]+:[0-9]+' | sed 's/^ *//')
  echo "eslint:  ${out:-no problems}" | head -1; echo "$out" | sed -n '2,$p' | sed 's/^/         /'
  cp vue-ts/variants/$v.vue vue-ts/src/App.vue
  out=$(cd vue-ts && npx vue-tsc --build 2>&1 | grep 'error TS')
  echo "vue-tsc: ${out:-no errors}" | head -1; echo "$out" | sed -n '2,$p' | sed 's/^/         /'
done
cp vue/variants/fixed.vue vue/src/App.vue; cp vue-ts/variants/fixed.vue vue-ts/src/App.vue
