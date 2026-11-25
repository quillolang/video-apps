// Cuts the code the video shows out of each app's real file: lines, not retyped, so it can't drift from what ran.
//   node snippets.mjs     writes snippets/<app>-<part>.<ext>
import fs from 'node:fs';
const A = {
  react: ['react/src/App.jsx', 'jsx', '//'], vue: ['vue/src/App.vue', 'vue', '<!--'], svelte: ['svelte/src/App.svelte', 'svelte', '<!--'],
  solid: ['solid/src/App.jsx', 'jsx', '//'], reflex: ['reflex/inbox/inbox.py', 'py', '#'], nicegui: ['nicegui/main.py', 'py', '#'],
  streamlit: ['streamlit/app.py', 'py', '#'], leptos: ['leptos/src/main.rs', 'rust', '//'], dioxus: ['dioxus/src/main.rs', 'rust', '//'],
  quillo: ['../app/main.qwe', 'qwe', '//'],
};
// [first line text, last line text] pairs, each found in the file; the pieces are joined by a "⋮" line.
const PARTS = {
  details: {
    react: [["const label = open", "const label = open"], ['box-details', '</section>']],
    vue: [["const label = computed", "const label = computed"], ['box-details', '</section>']],
    svelte: [["let label = $derived", "let label = $derived"], ['box-details', '</section>']],
    solid: [["const label = () =>", "const label = () =>"], ['box-details', '</section>']],
    reflex: [['rx.el.section(\n            rx.el.h2("Details")', 'class_name="box box-details",\n        ),']],
    nicegui: [["box box-details", "bind_visibility_from(state, 'open')"]],
    streamlit: [['key="box-details"', 'Ships in 2 days']],
    leptos: [["let label = move ||", "let label = move ||"], ['box-details', '</section>']],
    dioxus: [["let label = if open()", "let label = if open()"], ['section { class: "box box-details"', '                }\n            }']],
    quillo: [["let label = open", "let label = open"], ['box-details', '</section>']],
  },
  status: {
    react: [["{status === 'loading'", ": <span>3 messages</span>}"]], vue: [['<p class="out">\n        <em', '</p>']], svelte: [["{#if status === 'loading'}", '{/if}']],
    solid: [['<Switch fallback', '</Switch>']], reflex: [['rx.match(', '                ),']], nicegui: [['def status_line', "ui.label('3 messages')"]],
    streamlit: [['match ss.status', 'st.markdown("3 messages")']], leptos: [['{move || match status.get()', '}}']],
    dioxus: [['match status()', '                    }']], quillo: [['{match status {', '}}</p>']],
  },
  zero: {
    react: [['Inbox{', 'Inbox{']], vue: [['Inbox<span', 'Inbox<span']], svelte: [['Inbox{#if', 'Inbox{#if']], solid: [['Inbox<Show', 'Inbox<Show']],
    reflex: [['"Inbox",', 'rx.cond(State.unread']], nicegui: [["ui.label('Inbox')", 'bind_visibility_from(state, \'unread\'']],
    streamlit: [['st.markdown("Inbox"', 'st.markdown("Inbox"']], leptos: [['"Inbox"', '</Show>']], dioxus: [['"Inbox"', '                    }']],
    quillo: [['Inbox{', 'Inbox{']],
  },
  switch: {
    react: [['{joining\n', '/>}']], vue: [['<input v-if="joining"', '<input v-else']], svelte: [['{#if joining}', '{/if}']],
    solid: [['<Show when={joining()}', '</Show>']], reflex: [['rx.cond(\n                State.joining,', 'aria_label="Your email"),\n            ),']], nicegui: [['def email()', "ui.input(placeholder='Your email')"]],
    streamlit: [['if ss.joining:', 'st.text_input("Your email"']], leptos: [['<Show\n', '</Show>']], dioxus: [['                if joining() {\n                    input', 'aria_label: "Your email" }\n                }']],
    quillo: [['{joining\n', '/>}']],
  },
  keep: {
    react: [['{shown && <Counter', '{shown && <Counter']], vue: [['<ClickCounter v-if', '<ClickCounter v-if']], svelte: [['{#if shown}', '{/if}']],
    solid: [['<Show when={shown()}>', '</Show>']], reflex: [['rx.cond(State.shown, Counter', 'rx.cond(State.shown, Counter']],
    nicegui: [["counter().bind_visibility_from", "counter().bind_visibility_from"]], streamlit: [['if ss.shown:', 'counter()']],
    leptos: [['<Show when=move || shown.get()>', '</Show>']], dioxus: [['if shown() {\n', '                }']], quillo: [['{shown && <Counter/>}', '{shown && <Counter/>}']],
  },
};
fs.mkdirSync('snippets', { recursive: true });
const dedent = (ls) => { const n = Math.min(...ls.filter((l) => l.trim()).map((l) => l.match(/^ */)[0].length)); return ls.map((l) => l.slice(n)); };
for (const [part, apps] of Object.entries(PARTS)) for (const [app, ranges] of Object.entries(apps)) {
  const [file, ext, cmt] = A[app]; const text = fs.readFileSync(file, 'utf8'); const lines = text.split('\n'); const pieces = [];
  for (const [a, b] of ranges) {
    const ai = text.indexOf(a); if (ai < 0) throw new Error(`${app}/${part}: no ${JSON.stringify(a)}`);
    const first = text.slice(0, ai).split('\n').length - 1;
    const bi = text.indexOf(b, ai + (a === b ? 0 : 1)); if (bi < 0) throw new Error(`${app}/${part}: no ${JSON.stringify(b)} after`);
    const last = text.slice(0, bi + b.length).split('\n').length - 1;
    pieces.push(dedent(lines.slice(first, last + 1)));
  }
  const gap = cmt === '<!--' ? '<!-- ... -->' : `${cmt} ...`;
  const out = pieces.map((p) => p.join('\n')).join(`\n${gap}\n`) + '\n';
  fs.writeFileSync(`snippets/${app}-${part}.${ext}`, out);
}
console.log(fs.readdirSync('snippets').length, 'snippets');
