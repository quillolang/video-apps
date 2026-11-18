#!/bin/bash
# Builds the Spring Boot Trail Guide three ways, each in its own copy under <dir>, with its own jar (./app.jar):
#   app     spring/ as it is: Spring Boot's own error pages (the Whitelabel page in a browser, JSON for curl)
#   pages   with variants/pages: templates/error/4xx.html, the site's own page for every 4xx error
#   regex   that page too, and variants/regex: the id's pattern in the mapping, {id:[1-9][0-9]*}
# Run each with:  java -jar <dir>/<version>/app.jar --server.port=8091
set -e
out=$(mkdir -p "$1" && cd "$1" && pwd)
cd "$(dirname "$0")/spring"
for v in app pages regex; do
	d="$out/$v"
	rm -rf "$d"
	mkdir -p "$d"
	cp -R pom.xml src "$d/"
	case $v in
		pages) cp -R variants/pages/. "$d/" ;;
		regex) cp -R variants/pages/. "$d/"; cp -R variants/regex/. "$d/" ;;
	esac
	(cd "$d" && mvn -q -DskipTests package && cp target/trailguide-0.0.1-SNAPSHOT.jar app.jar)
done
