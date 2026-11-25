<For each={TODOS.filter((t) => showDone() || !t.done)}>{(t) => <li>{t.text}</li>}</For>
