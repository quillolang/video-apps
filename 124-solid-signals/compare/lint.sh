#!/bin/bash
# Each Solid version through the starter's own lint rules: oxlint with eslint-plugin-solid's v2 config, as the
# starter's oxlint.config.js sets it up. (Its `npm run lint` runs `oxlint src`, which reported nothing for any of
# them here; naming the config, `-c oxlint.config.js`, turns the rules on.) Long lines are folded at 104 columns.
cd "$(dirname "$0")/solid"
for v in body destructure fixed; do
  echo "== $v.jsx"
  out=$(npx oxlint -c oxlint.config.js variants/$v.jsx 2>&1 | grep -E '^variants/' | sed 's/^variants\///')
  echo "${out:-no problems}" | while IFS= read -r line; do echo "$line" | fold -s -w 104 | sed -e 's/ *$//' -e '2,$s/^/    /'; done
done
