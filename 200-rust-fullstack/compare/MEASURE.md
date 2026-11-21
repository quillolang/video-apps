# Leptos, Dioxus and Quillo: what was run

Every result in the video comes from the runs below. `build.sh` builds each Rust side in release mode as its starter sets it up (and the
variants: Leptos with `SsrMode::Async`, Dioxus with the size settings of its guide); `measure.sh` uses each app in Chromium (`probe.mjs`,
`routes.mjs`); `run-compare.sh` keeps the curl runs; `errors.sh` the compile errors. `../make-video.py` checks the narration against them.
Home paths in the output read `/Users/you`. Long compiler output is shown in the video in part: the first error, its arrow and its lines.
The start-axum template's browser tests (`leptos/end2end/`) pin `@playwright/test` 1.44 (GHSA-7mvr-c777-76hp, fixed in 1.55.1); their
`package.json` and lockfile are kept as `*.starter`, so GitHub doesn't flag the published copy. Nothing here uses them.

- **When:** 2026-11-21 22:29 +08
- **Machine:** Apple M5, 16 GB; macOS 26.7.1 (builds at background priority, 2 jobs)
- **Rust:** rustc 1.99.0; cargo-leptos 0.3.12; dx 0.7.10
- **Leptos:** 0.8.23 (Cargo.lock), start-axum template
- **Dioxus:** 0.7.10 (Cargo.lock), dx new, fullstack + router
- **Quillo:** 0.8.8 (f35bf2d)
- **Browser:** Chromium (Playwright's), headless

## The docs quoted

- The Leptos book, "Async Rendering and SSR Modes": "Requires JavaScript to be enabled for suspended fragments to appear in correct order."
- The Leptos book, "Islands": "It also means that the entire app has to be shipped to the client as JavaScript in order to be hydrated."
- The Leptos book, "Passing Children to Components": "If you need a `Fn` or `FnMut` here because you need to call `children` more than once, we also provide `ChildrenFn` and `ChildrenMut` aliases."
- Dioxus docs, "Server Side Rendering": "Dioxus employs the second approach." (after "Default to SSR, add reactivity with islands / Default to CSR, caching some data from the server")
- Dioxus docs, "Components": "`PartialEq`: used to identify if a component needs to be rerendered"
- Dioxus 0.7.10, examples/07-fullstack/custom_error_page.rs: "Note that you can commit any status code you want with `commit_http_status`."
- Quillo's guide: "A `view` is made on the server only. A `component` is made on the server and resumes in the browser; nothing else on the page needs JavaScript."

## The runs

```
# runs/01-versions.txt
$ rustc --version && cargo leptos --version && dx --version && quillo version
rustc 1.99.0 (b940084d7 2026-09-28)
cargo-leptos 0.3.12
dioxus 0.7.10 (57d6794)
quillo 0.8.8 (f35bf2d, 2026-11-19)

# runs/02-lines.txt
$ wc -l leptos/src/*.rs dioxus/src/main.rs quillo/main.qwe
     262 leptos/src/app.rs
       9 leptos/src/lib.rs
      39 leptos/src/main.rs
     223 dioxus/src/main.rs
     118 quillo/main.qwe
     651 total

# runs/03-check.txt
$ quillo check main.qwe
main.qwe: ok (1 route, 9 functions, 5 components)

# runs/03-check-quillo-fold.txt
$ quillo check main.qwe
main.qwe: ok (1 route, 8 functions, 6 components)

# runs/03-check-quillo-title.txt
$ quillo check main.qwe
main.qwe: ok (1 route, 11 functions, 5 components)

# runs/04-sizes.txt
$ ls -l leptos/trails leptos/site/pkg/trails.wasm dioxus/server dioxus/public/assets/*.wasm dioxus-tuned/public/assets/*.wasm | awk '{ print $5, $9 }'
1375736 dioxus-tuned/public/assets/trails_bg-dxhff6df3d46c06ef.wasm
2704648 dioxus/public/assets/trails_bg-dxh43c38e728ccfe3fa.wasm
7052448 dioxus/server
616366 leptos/site/pkg/trails.wasm
9973472 leptos/trails

# runs/10-main-leptos.txt
$ curl -s localhost:8210/trails/2 | grep -o '<main[^>]*>.\{0,52\}'
<main><!--s-1-o--><p class="muted">Loading…</p><!--s-1-c--

# runs/11-main-dioxus.txt
$ curl -s localhost:8211/trails/2 | grep -o '<main[^>]*>.\{0,64\}'
<main data-node-hydration="6"><!--placeholder7--><h1 data-node-hydration="8"><!--node-id9-->Ea

# runs/12-h1-quillo.txt
$ curl -s localhost:8200/trails/2 | grep -o '<h1>[^<]*'
<h1>Eagle Ridge 

# runs/12-main-quillo.txt
$ curl -s localhost:8200/trails/2 | grep -o '<main[^>]*>.\{0,96\}'
<main><quillo-island style="display:contents" data-c="TrailPage" data-p="{}" data-s="{&quot;trail&quot

# runs/13-main-leptos-async.txt
$ curl -s localhost:8212/trails/2 | grep -o '<main[^>]*>.\{0,52\}'
<main><h1>Eagle Ridge<!> <span class="badge hard">hard</sp

# runs/14-title-dioxus.txt
$ curl -s localhost:8211/trails/2 | grep -o '<title>[^<]*</title>'
<title>Eagle Ridge · Trail Guide</title>

# runs/14-title-leptos.txt
$ curl -s localhost:8210/trails/2 | grep -o '<title>[^<]*</title>'
<title>Eagle Ridge · Trail Guide</title>

# runs/14-title-quillo.txt
$ curl -s localhost:8200/trails/2 | grep -o '<title>[^<]*</title>'
<title>Trail Guide</title>

# runs/15-status-dioxus.txt
$ for p in /trails/2 /trails/99 /nope; do curl -s -o /dev/null -w "$p %{http_code}\\n" localhost:8211$p; done
/trails/2 200
/trails/99 404
/nope 404

# runs/15-status-leptos.txt
$ for p in /trails/2 /trails/99 /nope; do curl -s -o /dev/null -w "$p %{http_code}\\n" localhost:8210$p; done
/trails/2 200
/trails/99 404
/nope 404

# runs/15-status-quillo.txt
$ for p in /trails/2 /trails/99 /nope; do curl -s -o /dev/null -w "$p %{http_code}\\n" localhost:8200$p; done
/trails/2 200
/trails/99 404
/nope 404

# runs/20-downloads.txt
$ for s in leptos dioxus dioxus-tuned quillo; do printf '%-13s' $s; grep 'all of it' runs/probe-$s.txt | awk '{ print $(NF-3), $(NF-2), $(NF-1), $NF }'; done
leptos       640095 bytes, 245630 gzipped
dioxus       2773424 bytes, 744649 gzipped
dioxus-tuned 1429767 bytes, 512918 gzipped
quillo       177419 bytes, 49976 gzipped

# runs/err-dioxus-missing.txt
$ dx build --release --platform web
  0.00s  INFO Building project...
  3.14s  INFO  warning: use of deprecated method `BadgePropsBuilder::<((),)>::build`: Missing required field level
   --> src/main.rs:117:19
    |
117 |             Badge {}
    |                   ^^
    |
    = note: `#[warn(deprecated)]` on by default


  3.16s  INFO  warning: use of deprecated method `BadgePropsBuilder::<((),)>::build`: Missing required field level
   --> src/main.rs:117:19
    |
117 |             Badge {}
    |                   ^^
    |
    = note: `#[warn(deprecated)]` on by default


  3.29s  INFO  error[E0061]: this method takes 1 argument but 0 arguments were supplied
   --> src/main.rs:117:19
    |
117 |             Badge {}
    |                   ^^ argument #1 of type `BadgePropsBuilder_Error_Missing_required_field_level` is missing
    |
note: method defined here
   --> src/main.rs:107:1
    |
107 | #[component]
    | ^^^^^^^^^^^^
    = note: this error originates in the derive macro `Props` (in Nightly builds, run with -Z macro-backtrace for more info)
help: provide the argument
    |
117 |             Badge {}(/* BadgePropsBuilder_Error_Missing_required_field_level */)
    |                     ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


  3.36s  INFO  error[E0061]: this method takes 1 argument but 0 arguments were supplied
   --> src/main.rs:117:19
    |
117 |             Badge {}
    |                   ^^ argument #1 of type `BadgePropsBuilder_Error_Missing_required_field_level` is missing
    |
note: method defined here
   --> src/main.rs:107:1
    |
107 | #[component]
    | ^^^^^^^^^^^^
    = note: this error originates in the derive macro `Props` (in Nightly builds, run with -Z macro-backtrace for more info)
help: provide the argument
    |
117 |             Badge {}(/* BadgePropsBuilder_Error_Missing_required_field_level */)
    |                     ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


  3.44s  INFO  For more information about this error, try `rustc --explain E0061`.

  3.53s  INFO  For more information about this error, try `rustc --explain E0061`.

  3.54s  WARN error: could not compile `trails` (bin "trails") due to 1 previous error; 1 warning emitted 
  3.54s  WARN Caused by: 

ERROR dx build: cargo build finished with errors for target: trails [wasm32-unknown-unknown]
(exit 1)

# runs/err-dioxus-partialeq.txt
$ dx build --release --platform web
  0.00s  INFO Building project...
  2.66s  INFO  error[E0369]: binary operation `==` cannot be applied to type `Trail`
   --> src/main.rs:112:1
    |
112 | #[component]
    | ^^^^^^^^^^^^
    |
note: an implementation of `PartialEq` might be missing for `Trail`
   --> src/main.rs:8:1
    |
  8 | struct Trail { id: u32, name: String, km: f32, climb: u32, level: String, about: String }
    | ^^^^^^^^^^^^ must implement `PartialEq`
    = note: this error originates in the attribute macro `component` (in Nightly builds, run with -Z macro-backtrace for more info)
help: consider annotating `Trail` with `#[derive(PartialEq)]`
    |
  8 + #[derive(PartialEq)]
  9 | struct Trail { id: u32, name: String, km: f32, climb: u32, level: String, about: String }
    |


  2.84s  INFO  For more information about this error, try `rustc --explain E0369`.

  2.87s  WARN error: could not compile `trails` (bin "trails") due to 1 previous error 
  2.87s  INFO  error[E0369]: binary operation `==` cannot be applied to type `Trail`
   --> src/main.rs:112:1
    |
112 | #[component]
    | ^^^^^^^^^^^^
    |
note: an implementation of `PartialEq` might be missing for `Trail`
   --> src/main.rs:8:1
    |
  8 | struct Trail { id: u32, name: String, km: f32, climb: u32, level: String, about: String }
    | ^^^^^^^^^^^^ must implement `PartialEq`
    = note: this error originates in the attribute macro `component` (in Nightly builds, run with -Z macro-backtrace for more info)
help: consider annotating `Trail` with `#[derive(PartialEq)]`
    |
  8 + #[derive(PartialEq)]
  9 | struct Trail { id: u32, name: String, km: f32, climb: u32, level: String, about: String }
    |


  3.07s  INFO  For more information about this error, try `rustc --explain E0369`.

  3.09s  WARN error: could not compile `trails` (bin "trails") due to 1 previous error 
  3.09s  WARN Caused by: 
  3.09s  WARN   process didn't exit successfully: `/Users/you/dev/quillo-videos/.cache/rust-tools/bin/dx /Users/you/.rustup/toolchains/stable-aarch64-apple-darwin/bin/rustc --crate-name trails --edition=2021 src/main.rs --error-format=json --json=diagnostic-rendered-ansi,artifacts,future-incompat --crate-type bin --emit=dep-info,link -C opt-level=3 -C embed-bitcode=no --cfg 'feature="server"' --check-cfg 'cfg(docsrs,test)' --check-cfg 'cfg(feature, values("default", "desktop", "mobile", "server", "web"))' -C metadata=a9da59a7303f1111 -C extra-filename=-efd5f4ec224e7033 --out-dir /Users/you/dev/quillo-videos/.cache/rust-target/v200-target/dioxus/aarch64-apple-darwin/server-release/deps --target aarch64-apple-darwin -L dependency=/Users/you/dev/quillo-videos/.cache/rust-target/v200-target/dioxus/aarch64-apple-darwin/server-release/deps -L dependency=/Users/you/dev/quillo-videos/.cache/rust-target/v200-target/dioxus/server-release/deps --extern dioxus=/Users/you/dev/quillo-videos/.cache/rust-target/v200-target/dioxus/aarch64-apple-darwin/server-release/deps/libdioxus-8472f2f654bd52ba.rlib --extern serde=/Users/you/dev/quillo-videos/.cache/rust-target/v200-target/dioxus/aarch64-apple-darwin/server-release/deps/libserde-562729230e148e81.rlib --extern serde_json=/Users/you/dev/quillo-videos/.cache/rust-target/v200-target/dioxus/aarch64-apple-darwin/server-release/deps/libserde_json-ad039e48cbbbf016.rlib '-Clink-arg=-Wl,-rpath,@executable_path/../Frameworks' '-Clink-arg=-Wl,-rpath,@executable_path' -L native=/Users/you/dev/quillo-videos/.cache/rust-target/v200-target/dioxus/aarch64-apple-darwin/server-release/build/ring-8c5a159dda4e0a43/out` (exit status: 1) 

ERROR dx build: cargo build finished with errors for target: trails [wasm32-unknown-unknown]
(exit 1)

# runs/err-leptos-missing.txt
$ cargo leptos build --release
    Metadata keys ["env"] from metadata.leptos are not recognized and will be ignored
warning: use of deprecated method `app::BadgePropsBuilder::build`: Missing required field level
   --> src/app.rs:119:5
    |
119 | /     view! {
120 | |         <li>
121 | |             <a href=format!("/trails/{}", trail.id)>{trail.name}</a>
122 | |             <Badge/>
123 | |             <span class="facts">{trail.km} " km · " {trail.climb} " m climb"</span>
124 | |         </li>
125 | |     }
    | |_____^
    |
    = note: `#[warn(deprecated)]` on by default
    = note: this warning originates in the macro `view` (in Nightly builds, run with -Z macro-backtrace for more info)

error[E0061]: this method takes 1 argument but 0 arguments were supplied
   --> src/app.rs:119:5
    |
119 | /     view! {
120 | |         <li>
121 | |             <a href=format!("/trails/{}", trail.id)>{trail.name}</a>
122 | |             <Badge/>
123 | |             <span class="facts">{trail.km} " km · " {trail.climb} " m climb"</span>
124 | |         </li>
125 | |     }
    | |_____^ argument #1 of type `BadgePropsBuilder_Error_Missing_required_field_level` is missing
    |
note: method defined here
   --> src/app.rs:112:1
    |
112 | #[component]
    | ^^^^^^^^^^^^
    = note: this error originates in the macro `view` which comes from the expansion of the derive macro `::leptos::typed_builder_macro::TypedBuilder` (in Nightly builds, run with -Z macro-backtrace for more info)

warning: use of deprecated method `app::BadgePropsBuilder::build`: Missing required field level
   --> src/app.rs:119:5
    |
119 | /     view! {
120 | |         <li>
121 | |             <a href=format!("/trails/{}", trail.id)>{trail.name}</a>
122 | |             <Badge/>
123 | |             <span class="facts">{trail.km} " km · " {trail.climb} " m climb"</span>
124 | |         </li>
125 | |     }
    | |_____^
    |
    = note: `#[warn(deprecated)]` on by default
    = note: this warning originates in the macro `view` (in Nightly builds, run with -Z macro-backtrace for more info)

For more information about this error, try `rustc --explain E0061`.
warning: `trails` (lib) generated 1 warning
error: could not compile `trails` (lib) due to 1 previous error; 1 warning emitted
error[E0061]: this method takes 1 argument but 0 arguments were supplied
   --> src/app.rs:119:5
    |
119 | /     view! {
120 | |         <li>
121 | |             <a href=format!("/trails/{}", trail.id)>{trail.name}</a>
122 | |             <Badge/>
123 | |             <span class="facts">{trail.km} " km · " {trail.climb} " m climb"</span>
124 | |         </li>
125 | |     }
    | |_____^ argument #1 of type `BadgePropsBuilder_Error_Missing_required_field_level` is missing
    |
note: method defined here
   --> src/app.rs:112:1
    |
112 | #[component]
    | ^^^^^^^^^^^^
    = note: this error originates in the macro `view` which comes from the expansion of the derive macro `::leptos::typed_builder_macro::TypedBuilder` (in Nightly builds, run with -Z macro-backtrace for more info)

For more information about this error, try `rustc --explain E0061`.
warning: `trails` (lib) generated 1 warning
error: could not compile `trails` (lib) due to 1 previous error; 1 warning emitted
Error: 
   0: Failed to build trails

Location:
   /Users/you/.cargo/registry/src/index.crates.io-1949cf8c6b5b557f/cargo-leptos-0.3.12/src/command/build.rs:25

Backtrace omitted. Run with RUST_BACKTRACE=1 environment variable to display it.
Run with RUST_BACKTRACE=full to include source snippets.
(exit 1)

# runs/err-leptos-show.txt
$ cargo leptos build --release
    Metadata keys ["env"] from metadata.leptos are not recognized and will be ignored
error[E0525]: expected a closure that implements the `Fn` trait, but this closure only implements `FnOnce`
   --> src/app.rs:104:5
    |
104 | /     view! {
105 | |         <section class="card">
106 | |             <h2 on:click=move |_| open.update(|o| *o = !*o)>{title}</h2>
107 | |             <Show when=move || open.get()>{children()}</Show>
    | |                                            -------- closure is `FnOnce` because it moves the variable `children` out of its environment
108 | |             {footer.map(|f| view! { <footer>{(f.children)()}</footer> })}
109 | |         </section>
110 | |     }
    | |     ^
    | |     |
    | |_____this closure implements `FnOnce`, not `Fn`
    |       the requirement to implement `Fn` derives from here
    |
    = note: required for `TypedChildrenFn<AnyView>` to implement `leptos::prelude::ToChildren<{closure@src/app.rs:104:5: 110:6}>`
    = note: this error originates in the macro `view` (in Nightly builds, run with -Z macro-backtrace for more info)

error[E0277]: `dyn FnOnce() -> AnyView + Send` cannot be shared between threads safely
   --> src/app.rs:104:5
    |
104 | /     view! {
105 | |         <section class="card">
106 | |             <h2 on:click=move |_| open.update(|o| *o = !*o)>{title}</h2>
107 | |             <Show when=move || open.get()>{children()}</Show>
108 | |             {footer.map(|f| view! { <footer>{(f.children)()}</footer> })}
109 | |         </section>
110 | |     }
    | |_____^ `dyn FnOnce() -> AnyView + Send` cannot be shared between threads safely
    |
    = help: the trait `std::marker::Sync` is not implemented for `dyn FnOnce() -> AnyView + Send`
help: the following other types implement trait `leptos::prelude::ToChildren<F>`
   --> /Users/you/.cargo/registry/src/index.crates.io-1949cf8c6b5b557f/leptos-0.8.23/src/children.rs:415:1
    |
415 | / impl<F, C> ToChildren<F> for TypedChildrenFn<C>
416 | | where
417 | |     F: Fn() -> C + Send + Sync + 'static,
418 | |     C: IntoView,
419 | |     C::AsyncOutput: Send,
    | |_________________________^ `TypedChildrenFn<C>` implements `leptos::prelude::ToChildren<F>`
...
427 | / impl<T> ToChildren<ChildrenOptContainer<T>> for TypedChildrenFn<T>
428 | | where
429 | |     T: IntoView + Clone + Sync + 'static,
    | |_________________________________________^ `TypedChildrenFn<T>` implements `leptos::prelude::ToChildren<ChildrenOptContainer<T>>`
    = note: required for `std::ptr::Unique<dyn FnOnce() -> AnyView + Send>` to implement `std::marker::Sync`
note: required because it appears within the type `Box<dyn FnOnce() -> AnyView + Send>`
   --> /Users/you/.rustup/toolchains/stable-aarch64-apple-darwin/lib/rustlib/src/rust/library/alloc/src/boxed.rs:236:12
    |
236 | pub struct Box<
    |            ^^^
note: required because it's used within this closure
   --> src/app.rs:104:5
    |
104 | /     view! {
105 | |         <section class="card">
106 | |             <h2 on:click=move |_| open.update(|o| *o = !*o)>{title}</h2>
107 | |             <Show when=move || open.get()>{children()}</Show>
108 | |             {footer.map(|f| view! { <footer>{(f.children)()}</footer> })}
109 | |         </section>
110 | |     }
    | |_____^
    = note: required for `TypedChildrenFn<AnyView>` to implement `leptos::prelude::ToChildren<{closure@src/app.rs:104:5: 110:6}>`
    = note: this error originates in the macro `view` (in Nightly builds, run with -Z macro-backtrace for more info)

error[E0525]: expected a closure that implements the `Fn` trait, but this closure only implements `FnOnce`
   --> src/app.rs:104:5
    |
104 | /     view! {
105 | |         <section class="card">
106 | |             <h2 on:click=move |_| open.update(|o| *o = !*o)>{title}</h2>
107 | |             <Show when=move || open.get()>{children()}</Show>
    | |                                            -------- closure is `FnOnce` because it moves the variable `children` out of its environment
108 | |             {footer.map(|f| view! { <footer>{(f.children)()}</footer> })}
109 | |         </section>
110 | |     }
    | |     ^
    | |     |
    | |_____this closure implements `FnOnce`, not `Fn`
    |       the requirement to implement `Fn` derives from here
    |
    = note: required for `TypedChildrenFn<AnyView>` to implement `leptos::prelude::ToChildren<{closure@src/app.rs:104:5: 110:6}>`
    = note: this error originates in the macro `view` (in Nightly builds, run with -Z macro-backtrace for more info)

error[E0277]: `dyn FnOnce() -> AnyView + Send` cannot be shared between threads safely
   --> src/app.rs:104:5
    |
104 | /     view! {
105 | |         <section class="card">
106 | |             <h2 on:click=move |_| open.update(|o| *o = !*o)>{title}</h2>
107 | |             <Show when=move || open.get()>{children()}</Show>
108 | |             {footer.map(|f| view! { <footer>{(f.children)()}</footer> })}
109 | |         </section>
110 | |     }
    | |_____^ `dyn FnOnce() -> AnyView + Send` cannot be shared between threads safely
    |
    = help: the trait `std::marker::Sync` is not implemented for `dyn FnOnce() -> AnyView + Send`
help: the following other types implement trait `leptos::prelude::ToChildren<F>`
   --> /Users/you/.cargo/registry/src/index.crates.io-1949cf8c6b5b557f/leptos-0.8.23/src/children.rs:415:1
    |
415 | / impl<F, C> ToChildren<F> for TypedChildrenFn<C>
416 | | where
417 | |     F: Fn() -> C + Send + Sync + 'static,
418 | |     C: IntoView,
419 | |     C::AsyncOutput: Send,
    | |_________________________^ `TypedChildrenFn<C>` implements `leptos::prelude::ToChildren<F>`
...
427 | / impl<T> ToChildren<ChildrenOptContainer<T>> for TypedChildrenFn<T>
428 | | where
429 | |     T: IntoView + Clone + Sync + 'static,
    | |_________________________________________^ `TypedChildrenFn<T>` implements `leptos::prelude::ToChildren<ChildrenOptContainer<T>>`
    = note: required for `std::ptr::Unique<dyn FnOnce() -> AnyView + Send>` to implement `std::marker::Sync`
note: required because it appears within the type `Box<dyn FnOnce() -> AnyView + Send>`
   --> /Users/you/.rustup/toolchains/stable-aarch64-apple-darwin/lib/rustlib/src/rust/library/alloc/src/boxed.rs:236:12
    |
236 | pub struct Box<
    |            ^^^
note: required because it's used within this closure
   --> src/app.rs:104:5
    |
104 | /     view! {
105 | |         <section class="card">
106 | |             <h2 on:click=move |_| open.update(|o| *o = !*o)>{title}</h2>
107 | |             <Show when=move || open.get()>{children()}</Show>
108 | |             {footer.map(|f| view! { <footer>{(f.children)()}</footer> })}
109 | |         </section>
110 | |     }
    | |_____^
    = note: required for `TypedChildrenFn<AnyView>` to implement `leptos::prelude::ToChildren<{closure@src/app.rs:104:5: 110:6}>`
    = note: this error originates in the macro `view` (in Nightly builds, run with -Z macro-backtrace for more info)

Some errors have detailed explanations: E0277, E0525.
For more information about an error, try `rustc --explain E0277`.
error: could not compile `trails` (lib) due to 2 previous errors
Some errors have detailed explanations: E0277, E0525.
For more information about an error, try `rustc --explain E0277`.
error: could not compile `trails` (lib) due to 2 previous errors
Error: 
   0: Failed to build trails

Location:
   /Users/you/.cargo/registry/src/index.crates.io-1949cf8c6b5b557f/cargo-leptos-0.3.12/src/command/build.rs:25

Backtrace omitted. Run with RUST_BACKTRACE=1 environment variable to display it.
Run with RUST_BACKTRACE=full to include source snippets.
(exit 1)

# runs/err-leptos-showfn.txt
$ cargo leptos build --release
    Metadata keys ["env"] from metadata.leptos are not recognized and will be ignored
error[E0525]: expected a closure that implements the `Fn` trait, but this closure only implements `FnOnce`
   --> src/app.rs:225:47
    |
225 |                   trail.await.map(|t| t.map(|t| view! {
    |  _______________________________________________^
226 | |                     <Card title="Overview">
227 | |                         <Footer slot>"Kept by the trail club"</Footer>
228 | |                         <p>{t.about}</p>
    | |                          -  ------- closure is `FnOnce` because it moves the variable `t.about` out of its environment
    | |                          |
    | |                          required by a bound introduced by this call
229 | |                     </Card>
230 | |                 }))
    | |                 ^
    | |                 |
    | |_________________this closure implements `FnOnce`, not `Fn`
    |                   the requirement to implement `Fn` derives from here
    |
    = note: required for `Arc<dyn Fn() -> AnyView + Send + std::marker::Sync>` to implement `leptos::prelude::ToChildren<{closure@src/app.rs:225:47: 230:18}>`
    = note: this error originates in the macro `view` (in Nightly builds, run with -Z macro-backtrace for more info)

error[E0525]: expected a closure that implements the `Fn` trait, but this closure only implements `FnOnce`
   --> src/app.rs:245:21
    |
245 | /                     view! {
246 | |                         <Card title="Reviews">
247 | |                             <Footer slot>{n} " reviews"</Footer>
248 | |                             <ul class="reviews">
    | |                              - required by a bound introduced by this call
249 | |                                 {list.into_iter().map(|r| view! {
    | |                                  ---- closure is `FnOnce` because it moves the variable `list` out of its environment
...   |
257 | |                         </Card>
258 | |                     }
    | |                     ^
    | |                     |
    | |_____________________this closure implements `FnOnce`, not `Fn`
    |                       the requirement to implement `Fn` derives from here
    |
    = note: required for `Arc<dyn Fn() -> AnyView + Send + std::marker::Sync>` to implement `leptos::prelude::ToChildren<{closure@src/app.rs:245:21: 258:22}>`
    = note: this error originates in the macro `view` (in Nightly builds, run with -Z macro-backtrace for more info)

error[E0525]: expected a closure that implements the `Fn` trait, but this closure only implements `FnOnce`
   --> src/app.rs:225:47
    |
225 |                   trail.await.map(|t| t.map(|t| view! {
    |  _______________________________________________^
226 | |                     <Card title="Overview">
227 | |                         <Footer slot>"Kept by the trail club"</Footer>
228 | |                         <p>{t.about}</p>
    | |                          -  ------- closure is `FnOnce` because it moves the variable `t.about` out of its environment
    | |                          |
    | |                          required by a bound introduced by this call
229 | |                     </Card>
230 | |                 }))
    | |                 ^
    | |                 |
    | |_________________this closure implements `FnOnce`, not `Fn`
    |                   the requirement to implement `Fn` derives from here
    |
    = note: required for `Arc<dyn Fn() -> AnyView + Send + std::marker::Sync>` to implement `leptos::prelude::ToChildren<{closure@src/app.rs:225:47: 230:18}>`
    = note: this error originates in the macro `view` (in Nightly builds, run with -Z macro-backtrace for more info)

error[E0525]: expected a closure that implements the `Fn` trait, but this closure only implements `FnOnce`
   --> src/app.rs:245:21
    |
245 | /                     view! {
246 | |                         <Card title="Reviews">
247 | |                             <Footer slot>{n} " reviews"</Footer>
248 | |                             <ul class="reviews">
    | |                              - required by a bound introduced by this call
249 | |                                 {list.into_iter().map(|r| view! {
    | |                                  ---- closure is `FnOnce` because it moves the variable `list` out of its environment
...   |
257 | |                         </Card>
258 | |                     }
    | |                     ^
    | |                     |
    | |_____________________this closure implements `FnOnce`, not `Fn`
    |                       the requirement to implement `Fn` derives from here
    |
    = note: required for `Arc<dyn Fn() -> AnyView + Send + std::marker::Sync>` to implement `leptos::prelude::ToChildren<{closure@src/app.rs:245:21: 258:22}>`
    = note: this error originates in the macro `view` (in Nightly builds, run with -Z macro-backtrace for more info)

For more information about this error, try `rustc --explain E0525`.
error: could not compile `trails` (lib) due to 2 previous errors
For more information about this error, try `rustc --explain E0525`.
error: could not compile `trails` (lib) due to 2 previous errors
Error: 
   0: Failed to build trails

Location:
   /Users/you/.cargo/registry/src/index.crates.io-1949cf8c6b5b557f/cargo-leptos-0.3.12/src/command/build.rs:25

Backtrace omitted. Run with RUST_BACKTRACE=1 environment variable to display it.
Run with RUST_BACKTRACE=full to include source snippets.
(exit 1)

# runs/err-leptos-showfn2.txt
$ cargo leptos build --release
    Metadata keys ["env"] from metadata.leptos are not recognized and will be ignored
    Finished `wasm-release` profile [optimized] target(s) in 19.91s
       Cargo finished cargo build --package=trails --lib --target-dir=/Users/you/dev/quillo-videos/.cache/rust-target/v200-target/leptos/front --target=wasm32-unknown-unknown --no-default-features --features=hydrate --profile=wasm-release
       Front generating JS/WASM with wasm-bindgen
       Using wasm-bindgen version 0.2.130 detected in project
    Finished generating JS/WASM for front in 5.812458584s
    Finished `release` profile [optimized] target(s) in 55.78s
       Cargo finished cargo build --package=trails --bin=trails --no-default-features --features=ssr --release
(exit 0)

# runs/err-quillo-missing.txt
$ quillo check main.qwe
main.qwe:31: error: <Badge> needs `level`
quillo: 1 error

# runs/probe-dioxus.txt
open /             /                  loads 1  calls none              tab "Trail Guide"  ★ 0 saved
click Eagle Ridge  /trails/2/         loads 0  calls POST /api/trail   tab "Eagle Ridge · Trail Guide"  ★ 0 saved
click Reviews      /trails/2/reviews  loads 0  calls POST /api/reviews tab "Eagle Ridge · Trail Guide"  ★ 0 saved
click Save         /trails/2/reviews  loads 0  calls none              tab "Eagle Ridge · Trail Guide"  ★ 1 saved
click Overview     /trails/2/         loads 0  calls none              tab "Eagle Ridge · Trail Guide"  ★ 1 saved
Back               /trails/2/reviews  loads 0  calls POST /api/reviews tab "Eagle Ridge · Trail Guide"  ★ 1 saved
click Trail Guide  /                  loads 0  calls GET /api/trails   tab "Trail Guide"  ★ 1 saved
reload             /                  loads 1  calls none              tab "Trail Guide"  ★ 0 saved
downloads /assets/trails_bg-dxh43c38e728ccfe3fa.wasm     2704648 bytes,  728694 gzipped
downloads /assets/trails-dxhc992c061697fe9ad.js            68776 bytes,   15955 gzipped
downloads all of it                                      2773424 bytes,  744649 gzipped
no JS  open /             /                  loads 1  calls none              shows "Trails Fern Gully Loop eas"
no JS  click Eagle Ridge  /trails/2/         loads 1  calls none              shows "Eagle Ridge hard Overview "
no JS  open /trails/2     /trails/2          loads 1  calls none              shows "Eagle Ridge hard Overview "
no JS  click Reviews      /trails/2/reviews  loads 1  calls none              shows "Eagle Ridge hard Overview "
no JS  click Save         /trails/2/reviews  loads 0  calls none              shows "Eagle Ridge hard Overview "
no JS  open /trails/2/reviews  /trails/2/reviews  loads 1  calls none              shows "Eagle Ridge hard Overview "

# runs/probe-dioxus-tuned.txt
open /             /                  loads 1  calls none              tab "Trail Guide"  ★ 0 saved
click Eagle Ridge  /trails/2/         loads 1  calls none              tab "Eagle Ridge · Trail Guide"  ★ 0 saved
click Reviews      /trails/2/reviews  loads 1  calls POST /api/trail   tab "Eagle Ridge · Trail Guide"  ★ 0 saved
click Save         /trails/2/reviews  loads 0  calls none              tab "Eagle Ridge · Trail Guide"  ★ 0 saved
click Overview     /trails/2/         loads 1  calls none              tab "Eagle Ridge · Trail Guide"  ★ 0 saved
Back               /trails/2/reviews  loads 1  calls POST /api/trail   tab "Eagle Ridge · Trail Guide"  ★ 0 saved
click Trail Guide  /                  loads 0  calls none              tab "Eagle Ridge · Trail Guide"  ★ 0 saved
reload             /                  loads 1  calls none              tab "Trail Guide"  ★ 0 saved
downloads /assets/trails_bg-dxhff6df3d46c06ef.wasm       1375736 bytes,  499548 gzipped
downloads /assets/trails-dxh6b8c9ead1aa8e781.js            54031 bytes,   13370 gzipped
downloads all of it                                      1429767 bytes,  512918 gzipped
no JS  open /             /                  loads 1  calls none              shows "Trails Fern Gully Loop eas"
no JS  click Eagle Ridge  /trails/2/         loads 1  calls none              shows "Eagle Ridge hard Overview "
no JS  open /trails/2     /trails/2          loads 1  calls none              shows "Eagle Ridge hard Overview "
no JS  click Reviews      /trails/2/reviews  loads 1  calls none              shows "Eagle Ridge hard Overview "
no JS  click Save         /trails/2/reviews  loads 0  calls none              shows "Eagle Ridge hard Overview "
no JS  open /trails/2/reviews  /trails/2/reviews  loads 1  calls none              shows "Eagle Ridge hard Overview "

# runs/probe-leptos.txt
open /             /                  loads 1  calls none              tab "Trail Guide"  ★ 0 saved
click Eagle Ridge  /trails/2          loads 0  calls load_trail        tab "Eagle Ridge · Trail Guide"  ★ 0 saved
click Reviews      /trails/2/reviews  loads 0  calls load_reviews      tab "Eagle Ridge · Trail Guide"  ★ 0 saved
click Save         /trails/2/reviews  loads 0  calls none              tab "Eagle Ridge · Trail Guide"  ★ 1 saved
click Overview     /trails/2          loads 0  calls none              tab "Eagle Ridge · Trail Guide"  ★ 1 saved
Back               /trails/2/reviews  loads 0  calls load_reviews      tab "Eagle Ridge · Trail Guide"  ★ 1 saved
click Trail Guide  /                  loads 0  calls list_trails       tab "Trail Guide"  ★ 1 saved
reload             /                  loads 1  calls none              tab "Trail Guide"  ★ 0 saved
downloads /pkg/trails.js                                   23729 bytes,    6686 gzipped
downloads /pkg/trails.wasm                                616366 bytes,  238944 gzipped
downloads all of it                                       640095 bytes,  245630 gzipped
no JS  open /             /                  loads 1  calls none              shows "Trails Loading…"
no JS  click Eagle Ridge  /                  loads 0  calls none              shows "(nothing to click)"
no JS  open /trails/2     /trails/2          loads 1  calls none              shows "Loading…"
no JS  click Reviews      /trails/2          loads 0  calls none              shows "(nothing to click)"
no JS  click Save         /trails/2          loads 0  calls none              shows "(nothing to click)"
no JS  open /trails/2/reviews  /trails/2/reviews  loads 1  calls none              shows "Loading…"

# runs/probe-leptos-async.txt
open /             /                  loads 1  calls none              tab "Trail Guide"  ★ 0 saved
click Eagle Ridge  /trails/2          loads 0  calls load_trail        tab "Eagle Ridge · Trail Guide"  ★ 0 saved
click Reviews      /trails/2/reviews  loads 0  calls load_reviews      tab "Eagle Ridge · Trail Guide"  ★ 0 saved
click Save         /trails/2/reviews  loads 0  calls none              tab "Eagle Ridge · Trail Guide"  ★ 1 saved
click Overview     /trails/2          loads 0  calls none              tab "Eagle Ridge · Trail Guide"  ★ 1 saved
Back               /trails/2/reviews  loads 0  calls load_reviews      tab "Eagle Ridge · Trail Guide"  ★ 1 saved
click Trail Guide  /                  loads 0  calls list_trails       tab "Trail Guide"  ★ 1 saved
reload             /                  loads 1  calls none              tab "Trail Guide"  ★ 0 saved
downloads /pkg/trails.js                                   23729 bytes,    6686 gzipped
downloads /pkg/trails.wasm                                616366 bytes,  238947 gzipped
downloads all of it                                       640095 bytes,  245633 gzipped
no JS  open /             /                  loads 1  calls none              shows "Trails Fern Gully Loop eas"
no JS  click Eagle Ridge  /trails/2          loads 1  calls none              shows "Eagle Ridge hard Overview "
no JS  open /trails/2     /trails/2          loads 1  calls none              shows "Eagle Ridge hard Overview "
no JS  click Reviews      /trails/2/reviews  loads 1  calls none              shows "Eagle Ridge hard Overview "
no JS  click Save         /trails/2/reviews  loads 0  calls none              shows "Eagle Ridge hard Overview "
no JS  open /trails/2/reviews  /trails/2/reviews  loads 1  calls none              shows "Eagle Ridge hard Overview "

# runs/probe-quillo.txt
open /             /                  loads 1  calls none              tab "Trail Guide"  ★ 0 saved
click Eagle Ridge  /trails/2          loads 0  calls prefetch /trails/2, load_trail tab "Trail Guide"  ★ 0 saved
click Reviews      /trails/2/reviews  loads 0  calls prefetch /trails/2/reviews, load_reviews tab "Trail Guide"  ★ 0 saved
click Save         /trails/2/reviews  loads 0  calls none              tab "Trail Guide"  ★ 1 saved
click Overview     /trails/2          loads 0  calls prefetch /trails/2 tab "Trail Guide"  ★ 1 saved
Back               /trails/2/reviews  loads 0  calls load_reviews      tab "Trail Guide"  ★ 1 saved
click Trail Guide  /                  loads 0  calls prefetch /, list_trails tab "Trail Guide"  ★ 1 saved
reload             /                  loads 1  calls none              tab "Trail Guide"  ★ 0 saved
downloads /_quillo/b/41aa6934ff9463ca.js                   12081 bytes,    2892 gzipped
downloads /_quillo/r/6c835c423309e21a.js                  165338 bytes,   47084 gzipped
downloads all of it                                       177419 bytes,   49976 gzipped
no JS  open /             /                  loads 1  calls none              shows "Trails Fern Gully Loop eas"
no JS  click Eagle Ridge  /trails/2          loads 1  calls none              shows "Eagle Ridge hard Overview "
no JS  open /trails/2     /trails/2          loads 1  calls none              shows "Eagle Ridge hard Overview "
no JS  click Reviews      /trails/2/reviews  loads 1  calls none              shows "Eagle Ridge hard Overview "
no JS  click Save         /trails/2/reviews  loads 0  calls none              shows "Eagle Ridge hard Overview "
no JS  open /trails/2/reviews  /trails/2/reviews  loads 1  calls none              shows "Eagle Ridge hard Overview "

# runs/probe-quillo-title.txt
open /             /                  loads 1  calls none              tab "Trail Guide"  ★ 0 saved
click Eagle Ridge  /trails/2          loads 0  calls prefetch /trails/2, load_trail tab "Eagle Ridge · Trail Guide"  ★ 0 saved
click Reviews      /trails/2/reviews  loads 0  calls prefetch /trails/2/reviews, load_reviews tab "Eagle Ridge · Trail Guide"  ★ 0 saved
click Save         /trails/2/reviews  loads 0  calls none              tab "Eagle Ridge · Trail Guide"  ★ 1 saved
click Overview     /trails/2          loads 0  calls prefetch /trails/2 tab "Eagle Ridge · Trail Guide"  ★ 1 saved
Back               /trails/2/reviews  loads 0  calls load_reviews      tab "Eagle Ridge · Trail Guide"  ★ 1 saved
click Trail Guide  /                  loads 0  calls prefetch /, list_trails tab "Trail Guide"  ★ 1 saved
reload             /                  loads 1  calls none              tab "Trail Guide"  ★ 0 saved
downloads /_quillo/b/b1fbd5d73bc3e4e5.js                   12824 bytes,    3089 gzipped
downloads /_quillo/r/7af5d96809499576.js                  167486 bytes,   47795 gzipped
downloads all of it                                       180310 bytes,   50884 gzipped
no JS  open /             /                  loads 1  calls none              shows "Trails Fern Gully Loop eas"
no JS  click Eagle Ridge  /trails/2          loads 1  calls none              shows "Eagle Ridge hard Overview "
no JS  open /trails/2     /trails/2          loads 1  calls none              shows "Eagle Ridge hard Overview "
no JS  click Reviews      /trails/2/reviews  loads 1  calls none              shows "Eagle Ridge hard Overview "
no JS  click Save         /trails/2/reviews  loads 0  calls none              shows "Eagle Ridge hard Overview "
no JS  open /trails/2/reviews  /trails/2/reviews  loads 1  calls none              shows "Eagle Ridge hard Overview "

# runs/routes-dioxus.txt
dioxus
  /trails/2           200 Eagle Ridge hard     no JS: Eagle Ridge hard Overv tab: Eagle Ridge · Trail Guide
  /trails/2/reviews   200 Eagle Ridge hard     no JS: Eagle Ridge hard Overv tab: Eagle Ridge · Trail Guide
  /trails/02          200 Eagle Ridge hard     no JS: Eagle Ridge hard Overv tab: Eagle Ridge · Trail Guide
  /trails/+2          200 Eagle Ridge hard     no JS: Eagle Ridge hard Overv tab: Eagle Ridge · Trail Guide
  /trails/abc         404 404: No such page    no JS: 404: No such page ← Al tab: No such page
  /trails/99          404 404: No such trail   no JS: 404: No such trail ← A tab: No such trail
  /trails/4294967296  404 404: No such page    no JS: 404: No such page ← Al tab: No such page
  /nope               404 404: No such page    no JS: 404: No such page ← Al tab: No such page

# runs/routes-dioxus-tuned.txt
dioxus-tuned
  /trails/2           200 Eagle Ridge hard     no JS: Eagle Ridge hard Overv tab: Eagle Ridge · Trail Guide
  /trails/2/reviews   200 Eagle Ridge hard     no JS: Eagle Ridge hard Overv tab: Eagle Ridge · Trail Guide
  /trails/02          200 Eagle Ridge hard     no JS: Eagle Ridge hard Overv tab: Eagle Ridge · Trail Guide
  /trails/+2          200 Eagle Ridge hard     no JS: Eagle Ridge hard Overv tab: Eagle Ridge · Trail Guide
  /trails/abc         404 404: No such page    no JS: 404: No such page ← Al tab: No such page
  /trails/99          404 404: No such trail   no JS: 404: No such trail ← A tab: No such trail
  /trails/4294967296  404 404: No such page    no JS: 404: No such page ← Al tab: No such page
  /nope               404 404: No such page    no JS: 404: No such page ← Al tab: No such page

# runs/routes-leptos.txt
leptos
  /trails/2           200 Eagle Ridge hard     no JS: Loading…               tab: Eagle Ridge · Trail Guide
  /trails/2/reviews   200 Eagle Ridge hard     no JS: Loading…               tab: Eagle Ridge · Trail Guide
  /trails/02          200 Eagle Ridge hard     no JS: Loading…               tab: Eagle Ridge · Trail Guide
  /trails/+2          200 Eagle Ridge hard     no JS: Loading…               tab: Eagle Ridge · Trail Guide
  /trails/abc         404 404: No such trail   no JS: Loading…               tab: No such trail
  /trails/99          404 404: No such trail   no JS: Loading…               tab: No such trail
  /trails/4294967296  404 404: No such trail   no JS: Loading…               tab: No such trail
  /nope               404 404: No such page    no JS: 404: No such page ← Al tab: No such page

# runs/routes-leptos-async.txt
leptos-async
  /trails/2           200 Eagle Ridge hard     no JS: Eagle Ridge hard Overv tab: Eagle Ridge · Trail Guide
  /trails/2/reviews   200 Eagle Ridge hard     no JS: Eagle Ridge hard Overv tab: Eagle Ridge · Trail Guide
  /trails/02          200 Eagle Ridge hard     no JS: Eagle Ridge hard Overv tab: Eagle Ridge · Trail Guide
  /trails/+2          200 Eagle Ridge hard     no JS: Eagle Ridge hard Overv tab: Eagle Ridge · Trail Guide
  /trails/abc         404 404: No such trail   no JS: 404: No such trail ← A tab: No such trail
  /trails/99          404 404: No such trail   no JS: 404: No such trail ← A tab: No such trail
  /trails/4294967296  404 404: No such trail   no JS: 404: No such trail ← A tab: No such trail
  /nope               404 404: No such page    no JS: 404: No such page ← Al tab: No such page

# runs/routes-quillo.txt
quillo
  /trails/2           200 Eagle Ridge hard     no JS: Eagle Ridge hard Overv tab: Trail Guide
  /trails/2/reviews   200 Eagle Ridge hard     no JS: Eagle Ridge hard Overv tab: Trail Guide
  /trails/02          200 Eagle Ridge hard     no JS: Eagle Ridge hard Overv tab: Trail Guide
  /trails/+2          200 Eagle Ridge hard     no JS: Eagle Ridge hard Overv tab: Trail Guide
  /trails/abc         404 404: No such page    no JS: 404: No such page ← Al tab: Trail Guide
  /trails/99          404 404: No such trail   no JS: 404: No such trail ← A tab: Trail Guide
  /trails/4294967296  404 404: No such trail   no JS: 404: No such trail ← A tab: Trail Guide
  /nope               404 404: No such page    no JS: 404: No such page ← Al tab: Trail Guide

# runs/routes-quillo-title.txt
quillo-title
  /trails/2           200 Eagle Ridge hard     no JS: Eagle Ridge hard Overv tab: Eagle Ridge · Trail Guide
  /trails/2/reviews   200 Eagle Ridge hard     no JS: Eagle Ridge hard Overv tab: Eagle Ridge · Trail Guide
  /trails/02          200 Eagle Ridge hard     no JS: Eagle Ridge hard Overv tab: Eagle Ridge · Trail Guide
  /trails/+2          200 Eagle Ridge hard     no JS: Eagle Ridge hard Overv tab: Eagle Ridge · Trail Guide
  /trails/abc         404 404: No such page    no JS: 404: No such page ← Al tab: No such page
  /trails/99          404 404: No such trail   no JS: 404: No such trail ← A tab: No such trail
  /trails/4294967296  404 404: No such trail   no JS: 404: No such trail ← A tab: No such trail
  /nope               404 404: No such page    no JS: 404: No such page ← Al tab: No such page

```

The build logs are in `runs/build-*.txt`.
