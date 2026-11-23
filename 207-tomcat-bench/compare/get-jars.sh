#!/bin/sh
# Downloads the Tomcat app's three jars from Maven Central into $1 (the build folder's lib/), each checked against
# the SHA-1 Maven Central publishes beside it: sqlite-jdbc, and JSTL's API and implementation.
#   sh compare/get-jars.sh <folder>
set -eu
mkdir -p "$1"; cd "$1"
get() {
  f=$(basename "$1")
  [ -f "$f" ] && return 0
  curl -fsSLO "https://repo1.maven.org/maven2/$1"
  echo "$(curl -fsSL "https://repo1.maven.org/maven2/$1.sha1" | cut -c1-40)  $f" | shasum -a 1 -c
}
get org/xerial/sqlite-jdbc/3.54.1.0/sqlite-jdbc-3.54.1.0.jar
get jakarta/servlet/jsp/jstl/jakarta.servlet.jsp.jstl-api/3.0.2/jakarta.servlet.jsp.jstl-api-3.0.2.jar
get org/glassfish/web/jakarta.servlet.jsp.jstl/3.0.1/jakarta.servlet.jsp.jstl-3.0.1.jar
