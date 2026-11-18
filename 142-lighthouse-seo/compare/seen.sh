#!/bin/sh
# What a site's pages say before any script runs, as curl gets them: the sourdough page's title, description and
# heading, how many links to breads the home page has, and what an address with no bread answers.
#   ./seen.sh http://localhost:4173
b=$1
page=$(curl -s "$b/breads/sourdough")
desc=$(echo "$page" | grep -o '<meta name="description"[^>]*>')
h1=$(echo "$page" | grep -o '<h1>[^<]*' | sed 's/<h1>//')
echo "title:        $(echo "$page" | grep -o '<title>[^<]*</title>' | head -1)"
echo "description:  ${desc:-(none)}"
echo "heading:      ${h1:-(none)}"
echo "links:        $(curl -s "$b/" | grep -o 'href="/breads/[^"]*"' | wc -l | tr -d ' ') to breads, on the home page"
echo "/breads/nope: $(curl -s -o /dev/null -w '%{http_code}' "$b/breads/nope")"
