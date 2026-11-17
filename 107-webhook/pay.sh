#!/bin/sh
# The payment provider, for trying the webhook: sends an event to it, signed
# with the secret in .env, as the provider would. T=<unix time> signs it as
# sent then; PORT=8081 sends it to Node's.   ./pay.sh '{"id":"evt_1","order":42}'
. "$(dirname "$0")/.env"
body=$1
t=${T:-$(date +%s)}
sig=$(printf '%s.%s' "$t" "$body" | openssl dgst -sha256 -hmac "$PAY_WEBHOOK_SECRET" -hex | awk '{print $NF}')
curl -s localhost:${PORT:-8080}/hooks/pay -H "Pay-Signature: t=$t,v1=$sig" --json "$body"
