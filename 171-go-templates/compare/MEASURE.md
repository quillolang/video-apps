# Templates and escaping, Go's html/template vs Quillo's views: the measurements

Every result in the video comes from the runs below, copied from the run. `contexts.mjs` posts five notes to a board
and opens it in a real browser; its tables are `contexts-<side>.txt`, and what the server sent, the alerts, and the
style note's box are in `../assets/contexts-<side>.json`. Measured on one machine.

- **When:** Fri Nov 20 2026, about 01:00 +08 (the runs, again after the templates' long lines were broken), the screenshots after them
- **Machine:** Apple M5, arm64; macOS 26.7.1
- **Go:** go version go1.27.4 darwin/arm64 (from go.dev, in the project's .cache); `gofmt -l .` prints nothing and
  `go vet .` passes
- **Quillo:** `quillo 0.8.6 (238dac2, 2026-11-16)` (each folder's own, from its get-quillo.sh)
- **Browser:** Chromium (Playwright's), headless, 800x600 for the runs

## The boards

Trail Club's notes board: a visitor leaves a note (a name, a text, a link and a color), and the page shows them all in
one layout, each as `<li style="color: <color>" title="<name>"><text> <a href="<link>"><name></a></li>`, and the
latest note's name in a script (`const latest = <name>;`) that writes "Latest note: ..." under the list.

- **Go** (`go/`): `main.go`, the standard library only (`net/http`, `html/template`, `sync`): the notes in memory,
  `GET /{$}` runs the template `layout` (`templates/layout.html`, with `{{template "content" .}}`) and
  `templates/board.html`; `POST /notes` reads `r.FormValue` and redirects (303). Built with `go build`, on 8160.
- **Quillo, first board** (`../steps/v1/main.qwe`): a `view Page(children)` layout, `route GET /` with the list
  (`style={`color: ${n.color}`}`) and a `<script>` with `const latest = {latest};`, and
  `route POST /notes { form: { name: str, text: str, link: str, color: str } }`; `migrations/001_notes.sql`.
  `quillo check`: `main.qwe: ok (2 routes, 1 function, 0 components)`.
- **Quillo, with the color check** (`../app/main.qwe`): the same, with `let COLORS = ["green", "blue", "brown", "purple"]`
  and, in the form's route, `if !contains(COLORS, color) { return respond(400, "Pick a color: green, blue, brown or purple") }`.
  `quillo check`: `main.qwe: ok (2 routes, 1 function, 0 components)`.

## The runs (contexts.mjs)

Each side from a fresh board, its server started by the script. The notes (name, text, link, color):

- **text**: `Ana`, `<script>alert('text')</script>`, `/`, `green`
- **attr**: `x" onmouseover="alert('attr')`, `hello`, `/`, `green`
- **link**: `Click me`, `my route`, `javascript:alert('link')`, `green`
- **style**: `Cy`, `my note`, `/`, `red; position: fixed; inset: 0; background: red`
- **script**: `</script><script>alert('script')</script>`, `last`, `/`, `green` (the last note, so its name is the latest)

The page is loaded (any alert counted), each li hovered, the link clicked; the style note's li is measured ("took over
the page" is `position: fixed` and at least 790x590 of the 800x600 window).

```
$ node contexts.mjs go out.json
go
  text    stayed text
  attr    stayed text
  link    stayed text
  style   stayed in its note
  script  stayed text
  latest  "Latest note: </script><script>alert('script')</script>"
$ node contexts.mjs quillo-v1 out.json
quillo-v1
  text    stayed text
  attr    stayed text
  link    stayed text
  style   took over the page (position: fixed, 800x600)
  script  stayed text
  latest  "Latest note: </script><script>alert('script')</script>"
$ node contexts.mjs quillo out.json
quillo
  text    stayed text
  attr    stayed text
  link    stayed text
  style   refused (400: Pick a color: green, blue, brown or purple)
  script  stayed text
  latest  "Latest note: </script><script>alert('script')</script>"
```

What each server sent (its line breaks and indentation written as one space):

```
go
text    <li style="color: green" title="Ana"> &lt;script&gt;alert(&#39;text&#39;)&lt;/script&gt; <a href="/">Ana</a> </li>
attr    <li style="color: green" title="x&#34; onmouseover=&#34;alert(&#39;attr&#39;)"> hello <a href="/">x&#34; onmouseover=&#34;alert(&#39;attr&#39;)</a> </li>
link    <li style="color: green" title="Click me"> my route <a href="#ZgotmplZ">Click me</a> </li>
style   <li style="color: ZgotmplZ" title="Cy"> my note <a href="/">Cy</a> </li>
script  <li style="color: green" title="&lt;/script&gt;&lt;script&gt;alert(&#39;script&#39;)&lt;/script&gt;"> last <a href="/">&lt;/script&gt;&lt;script&gt;alert(&#39;script&#39;)&lt;/script&gt;</a> </li>
script  const latest = "\u003c/script\u003e\u003cscript\u003ealert('script')\u003c/script\u003e";

quillo-v1
text    <li style="color: green" title="Ana">&lt;script&gt;alert(&#39;text&#39;)&lt;/script&gt; <a href="/">Ana</a></li>
attr    <li style="color: green" title="x&quot; onmouseover=&quot;alert(&#39;attr&#39;)">hello <a href="/">x&quot; onmouseover=&quot;alert(&#39;attr&#39;)</a></li>
link    <li style="color: green" title="Click me">my route <a href="about:blank#blocked">Click me</a></li>
style   <li style="color: red; position: fixed; inset: 0; background: red" title="Cy">my note <a href="/">Cy</a></li>
script  <li style="color: green" title="&lt;/script&gt;&lt;script&gt;alert(&#39;script&#39;)&lt;/script&gt;">last <a href="/">&lt;/script&gt;&lt;script&gt;alert(&#39;script&#39;)&lt;/script&gt;</a></li>
script  const latest = "\u003c/script>\u003cscript>alert('script')\u003c/script>";

quillo
text    <li style="color: green" title="Ana">&lt;script&gt;alert(&#39;text&#39;)&lt;/script&gt; <a href="/">Ana</a></li>
attr    <li style="color: green" title="x&quot; onmouseover=&quot;alert(&#39;attr&#39;)">hello <a href="/">x&quot; onmouseover=&quot;alert(&#39;attr&#39;)</a></li>
link    <li style="color: green" title="Click me">my route <a href="about:blank#blocked">Click me</a></li>
style   refused: 400 Pick a color: green, blue, brown or purple
script  <li style="color: green" title="&lt;/script&gt;&lt;script&gt;alert(&#39;script&#39;)&lt;/script&gt;">last <a href="/">&lt;/script&gt;&lt;script&gt;alert(&#39;script&#39;)&lt;/script&gt;</a></li>
script  const latest = "\u003c/script>\u003cscript>alert('script')\u003c/script>";
```

Go wrote `ZgotmplZ` for the link and for the color: html/template's placeholder for a value that isn't safe where it
goes (for a CSS value, one with a `;` among other characters). Quillo escaped the color for HTML (it has no `"` or `<`
to escape) and doesn't read CSS. In the script, both wrote the name as a JavaScript string with `<` (Go also `>`) as
`\u003c`, so `</script>` can't end the script.

## The screenshots (../shots.mjs)

The five notes posted to a fresh board, then the page at 520x330: `go_board`, `v1_board` (the style note covers the
page), `q_board` (the style note refused).

## Not measured

No speed numbers: other work was running on the machine (everything here ran at background priority).
