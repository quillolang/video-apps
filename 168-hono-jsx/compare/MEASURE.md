# Escaping and layouts, hono/jsx vs Quillo's views: the measurements

Every result in the video comes from the runs below, copied from the run. `payloads.mjs` posts four notes to each
board and opens it in a real browser; what each server sent, and the alerts, are in `../assets/payloads-<side>.json`.
`links.py` posts nine links and prints the href each one got. Measured on one machine.

- **When:** Thu Nov 19 2026, 20:06 +08 (Hono's `bun install`), the runs and screenshots after it; Hono's table
  rewritten in the migration's shape and every Hono run and the screenshots done again at 20:14
- **Machine:** Apple M5, arm64; macOS 26.7.1
- **Bun:** 1.4.3; **Hono** 4.13.19 (with @types/bun 1.4.4: 6 packages installed, `install.txt`)
- **Quillo:** `quillo 0.8.6 (238dac2, 2026-11-16)` (the app folder's own, from its get-quillo.sh)
- **Browser:** Chromium (Playwright's), headless

## The two boards

Trail Club's notes board: a visitor leaves a note (name, text, link), and the page shows them all, as a list, inside
one layout (a head with the title, a header, the notes in `main`, a footer). Each note is
`<li title={name}>{text} <a href={link}>{name}</a></li>`.

- **Hono** (`hono/`, a package.json with `hono` and `@types/bun`, the tsconfig of Hono's JSX guide
  (`"jsx": "react-jsx"`, `"jsxImportSource": "hono/jsx"`), `bun install`): `src/index.tsx` makes the table with
  `bun:sqlite`, wraps every page in a `jsxRenderer` layout, renders the list with `c.render(...)`, and takes the form
  with `c.req.parseBody()`. Run with `bun run src/index.tsx` (port 3000).
  `variants/safe-link.tsx`: the same, with `const safe = (url: string) => (/^(https?:\/\/|\/)/i.test(url) ? url : '#')`
  and `href={safe(n.link)}`.
- **Quillo** (`../app/`): `main.qwe`, a `view Page(children)` for the layout, `route GET / with db` rendering the
  list inside `<Page>`, and `route POST /notes { form: { name: str, text: str, link: str } }`;
  `migrations/001_notes.sql` makes the table. `quillo check`: `main.qwe: ok (2 routes, 1 function, 0 components)`.

Lines (non-blank, not comments): Hono `src/index.tsx` 34; Quillo `main.qwe` 21 and `001_notes.sql` 6, 27 in all. The
table is written in the same shape in both (one column a line).

## Four notes (payloads.mjs)

Each side from a fresh `club.db`, its server started by the script. The notes (name, text, link):

- **script**: `Ana`, `<script>alert('script')</script>`, `/`
- **img**: `Ben`, `<img src=x onerror="alert('img')">`, `/`
- **quote**: `x" onmouseover="alert('quote')`, `hello`, `/` (breaks out of the li's `title="..."` if not escaped)
- **link**: `Click me`, `my route`, `javascript:alert('link')`

The page is loaded (any alert counted), each li hovered, and the last note's link clicked.

```
$ node payloads.mjs hono out.json
hono
  script  stayed text
  img     stayed text
  quote   stayed text
  link    RAN (click)
$ node payloads.mjs quillo out.json
quillo
  script  stayed text
  img     stayed text
  quote   stayed text
  link    stayed text
$ node payloads.mjs hono-safe out.json
hono-safe
  script  stayed text
  img     stayed text
  quote   stayed text
  link    stayed text
```

What each server sent:

```
hono
script  <li title="Ana">&lt;script&gt;alert(&#39;script&#39;)&lt;/script&gt; <a href="/">Ana</a></li>
img     <li title="Ben">&lt;img src=x onerror=&quot;alert(&#39;img&#39;)&quot;&gt; <a href="/">Ben</a></li>
quote   <li title="x&quot; onmouseover=&quot;alert(&#39;quote&#39;)">hello <a href="/">x&quot; onmouseover=&quot;alert(&#39;quote&#39;)</a></li>
link    <li title="Click me">my route <a href="javascript:alert(&#39;link&#39;)">Click me</a></li>

quillo
script  <li title="Ana">&lt;script&gt;alert(&#39;script&#39;)&lt;/script&gt; <a href="/">Ana</a></li>
img     <li title="Ben">&lt;img src=x onerror=&quot;alert(&#39;img&#39;)&quot;&gt; <a href="/">Ben</a></li>
quote   <li title="x&quot; onmouseover=&quot;alert(&#39;quote&#39;)">hello <a href="/">x&quot; onmouseover=&quot;alert(&#39;quote&#39;)</a></li>
link    <li title="Click me">my route <a href="about:blank#blocked">Click me</a></li>

hono-safe
script  <li title="Ana">&lt;script&gt;alert(&#39;script&#39;)&lt;/script&gt; <a href="/">Ana</a></li>
img     <li title="Ben">&lt;img src=x onerror=&quot;alert(&#39;img&#39;)&quot;&gt; <a href="/">Ben</a></li>
quote   <li title="x&quot; onmouseover=&quot;alert(&#39;quote&#39;)">hello <a href="/">x&quot; onmouseover=&quot;alert(&#39;quote&#39;)</a></li>
link    <li title="Click me">my route <a href="#">Click me</a></li>
```

The first three are the same, byte for byte, on all three: text and attributes are escaped. The link's href is kept
as given by Hono's JSX, and clicking it ran `alert('link')`; Quillo sent `about:blank#blocked`; the variant sent `#`.

## Nine links (links.py)

Each from an empty `club.db`; Quillo on port 8133 for this run.

```
$ python3 links.py http://localhost:3000
'javascript:alert(1)'                        -> javascript:alert(1)
'JavaScript:alert(1)'                        -> JavaScript:alert(1)
' javascript:alert(1)'                       ->  javascript:alert(1)
'java\tscript:alert(1)'                      -> java	script:alert(1)
'data:text/html,<script>alert(1)</script>'   -> data:text/html,&lt;script&gt;alert(1)&lt;/script&gt;
'vbscript:msgbox(1)'                         -> vbscript:msgbox(1)
'https://example.com/'                       -> https://example.com/
'/trails/2'                                  -> /trails/2
'mailto:ranger@example.com'                  -> mailto:ranger@example.com
$ python3 links.py http://127.0.0.1:8133
'javascript:alert(1)'                        -> about:blank#blocked
'JavaScript:alert(1)'                        -> about:blank#blocked
' javascript:alert(1)'                       -> about:blank#blocked
'java\tscript:alert(1)'                      -> about:blank#blocked
'data:text/html,<script>alert(1)</script>'   -> data:text/html,&lt;script&gt;alert(1)&lt;/script&gt;
'vbscript:msgbox(1)'                         -> about:blank#blocked
'https://example.com/'                       -> https://example.com/
'/trails/2'                                  -> /trails/2
'mailto:ranger@example.com'                  -> mailto:ranger@example.com
```

(The fourth link has a tab between `java` and `script`.) Quillo blocks `javascript:` in any case, with a leading space
or a tab inside, and `vbscript:`; it keeps `data:`, escaped, and https, a path and mailto. Hono keeps all nine as given.

## A data: link, clicked (datalink.mjs)

Quillo keeps `data:` links. One posted to the Quillo board and clicked in Chromium:

```
$ node datalink.mjs
href:    data:text/html,<script>alert(1)</script>
alerts:  none
page:    http://127.0.0.1:8132/
console: Not allowed to navigate top frame to data URL: data:text/html,<script>alert(1)</script>
```

## The screenshots (../shots.mjs)

Both boards with the four notes, from a fresh `club.db`: `hono_board.png` and `q_board.png`. The script checks that each
note's text shows as text, and that no alert came on load.

## Not measured

No speed numbers: other work was running on the machine (everything here ran at background priority).
