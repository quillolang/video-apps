#!/bin/sh
# The compile errors in the video, run for real: each variant in versions/ is put in place of the project's file for
# one build, then the file is put back. What each build printed (colours taken out) goes to runs/err-<name>.txt.
# Needs the builds first (build.sh), so only the Trail Guide's own crate is compiled again.
#   sh errors.sh
set -u
here=$(cd "$(dirname "$0")" && pwd); root=$(cd "$here/../../.." && pwd)
app=$here/../app; [ -f "$app/main.qwe" ] || app=$here/..    # in video-apps, the app is the folder itself
target=${TARGET_DIR:-$root/.cache/rust-target/v200-target}
export PATH="$root/.cache/rust-tools/bin:$HOME/.cargo/bin:/usr/bin:/bin:/usr/sbin" CARGO_BUILD_JOBS=2 NO_COLOR=1 TERM=dumb
strip() { sed -e 's/\x1b\[[0-9;]*[A-Za-z]//g' -e 's/\r//g' -e "s|$HOME|/Users/you|g"; }
try() {   # try <name> <project> <file> <variant> <command...>
  name=$1; dir=$2; file=$3; variant=$4; shift 4
  cp "$here/$dir/$file" "$here/$dir/$file.keep"; cp "$here/$dir/versions/$variant" "$here/$dir/$file"
  { printf '$ %s\n' "$*"; (cd "$here/$dir" && CARGO_TARGET_DIR=$target/$dir taskpolicy -b sh -c "$*" 2>&1); echo "(exit $?)"; } | strip > "$here/runs/err-$name.txt"
  mv "$here/$dir/$file.keep" "$here/$dir/$file"
  echo "err-$name: $(grep -m1 -E '^error' "$here/runs/err-$name.txt")"
}
mkdir -p "$here/runs"
for v in ${@:-show showfn showfn2 missing dx-missing dx-partialeq}; do
  case $v in
    show) try leptos-show leptos src/app.rs app.show.rs cargo leptos build --release ;;
    showfn) try leptos-showfn leptos src/app.rs app.showfn.rs cargo leptos build --release ;;
    showfn2) try leptos-showfn2 leptos src/app.rs app.showfn2.rs cargo leptos build --release ;;
    missing) try leptos-missing leptos src/app.rs app.missing.rs cargo leptos build --release ;;
    dx-missing) try dioxus-missing dioxus src/main.rs main.missing.rs dx build --release --platform web ;;
    dx-partialeq) try dioxus-partialeq dioxus src/main.rs main.nopartialeq.rs dx build --release --platform web ;;
  esac
done
{ printf '$ quillo check main.qwe\n'; (cd "$here/quillo-missing" && "$app/.quillo/bin/quillo" check main.qwe 2>&1); } > "$here/runs/err-quillo-missing.txt"
exit 0
