#!/bin/sh
# Sends the same odd values to the running Hono (8090) and Quillo (8080) apps, and shows what each does (edges.mjs).
cd "$(dirname "$0")" && node edges.mjs
