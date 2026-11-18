#!/bin/bash
# Builds the Spring Boot sign-ups API three ways, each in its own copy under <dir>, with its own jar (./app.jar):
#   naive     variants/naive: @RequestBody Signup, a plain record (String name, String email, int guests)
#   valid     spring/ as it is: the record's fields annotated (@NotBlank, @Email, @NotNull, @Min, @Max) and @Valid
#   detailed  that, and variants/detailed's application.properties: the reasons in the error, unknown fields refused
# Run each with:  java -jar <dir>/<version>/app.jar --server.port=8091
set -e
out=$(mkdir -p "$1" && cd "$1" && pwd)
cd "$(dirname "$0")/spring"
for v in naive valid detailed; do
	d="$out/$v"
	rm -rf "$d"
	mkdir -p "$d"
	cp -R pom.xml src "$d/"
	case $v in
		naive) cp -R variants/naive/. "$d/" ;;
		detailed) cp -R variants/detailed/. "$d/" ;;
	esac
	(cd "$d" && mvn -q -DskipTests package && cp target/signups-0.0.1-SNAPSHOT.jar app.jar)
done
