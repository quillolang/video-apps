#!/bin/bash
# Builds the Go Trail Guide three ways, each in its own copy under <dir>, with its own binary (./trailguide):
#   app        go/ as it is, on 8090
#   catch-all  its last pattern "/" instead of "GET /", on 8091: a pattern with no method takes every method
#   strict     the id must read back as the same text (strconv.Itoa(id) == the path's), so 02 and +2 are 404s, on 8092
# Uses the go on PATH, or $GO:   ./build-variants.sh build     then: cd build/app && ./trailguide
set -e
GO=${GO:-go}
out=$(mkdir -p "$1" && cd "$1" && pwd)
cd "$(dirname "$0")/go"
for v in app catch-all strict; do
	d="$out/$v"
	rm -rf "$d"
	mkdir -p "$d"
	cp -R main.go go.mod templates trails.json trails.css "$d/"
	case $v in
		catch-all) sed -i.bak -e 's|HandleFunc("GET /", func|HandleFunc("/", func|' -e 's|":8090"|":8091"|' "$d/main.go" ;;
		strict) sed -i.bak -e '/strconv.Atoi(r.PathValue/{' -e 'n' -e 's|if err != nil {|if err != nil \|\| strconv.Itoa(id) != r.PathValue("id") {|' \
			-e '}' -e 's|":8090"|":8092"|' "$d/main.go" ;;
	esac
	rm -f "$d/main.go.bak"
	(cd "$d" && "$GO" vet . && "$GO" build -o trailguide .)
done
