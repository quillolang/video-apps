#!/bin/sh
# Why the detailed Spring API (8092) refuses a body: the error's message, and each field's own message.
#   ./why.sh '{"name":"Ben","guests":1}'
curl -s -H 'Content-Type: application/json' -d "$1" localhost:8092/api/signups \
  | jq -c '{message, errors: [.errors[]? | {field, defaultMessage}]}'
