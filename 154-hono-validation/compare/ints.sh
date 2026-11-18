#!/bin/sh
# What a route pattern's int and the int function each make of the same text (ints.mjs, ints/main.qwe).
cd "$(dirname "$0")"
# The Quillo app is ../app in the video's own folder, and .. in github.com/quillolang/video-apps.
app=../app; [ -d "$app" ] || app=..
q=$(cd "$app" && pwd)/.quillo/bin/quillo
[ -x "$q" ] || (cd "$app" && sh get-quillo.sh) >&2
node ints.mjs "$q"
