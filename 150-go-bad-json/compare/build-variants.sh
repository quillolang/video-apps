#!/bin/bash
# Builds the Go sign-ups API two ways, each in its own copy under <dir>, with its own binary (./signups):
#   naive  variants/naive.go.txt as main.go: json.NewDecoder(r.Body).Decode(&s), and nothing else (on 8090)
#   fixed  go/main.go: DisallowUnknownFields, Guests a *int, and the rules in problems() (on 8091)
# Uses the go on PATH, or $GO:   ./build-variants.sh build     then: cd build/fixed && ./signups
set -e
GO=${GO:-go}
out=$(mkdir -p "$1" && cd "$1" && pwd)
cd "$(dirname "$0")/go"
for v in naive fixed; do
	d="$out/$v"
	rm -rf "$d"
	mkdir -p "$d"
	cp go.mod "$d/"
	if [ $v = naive ]; then cp variants/naive.go.txt "$d/main.go"; else sed 's|":8090"|":8091"|' main.go > "$d/main.go"; fi
	(cd "$d" && "$GO" vet . && "$GO" build -o signups .)
done
