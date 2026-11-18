import { createStore, For, Show } from 'solid-js';
import { start } from './board.js';
import './App.css';

export default function App() {
  const [board, setBoard] = createStore(structuredClone(start));

  const star = (id) =>
    setBoard((draft) => {
      const card = draft.flatMap((col) => col.cards).find((c) => c.id === id);
      card.starred = !card.starred;
    });

  const moveOn = (id) =>
    setBoard((draft) => {
      const from = draft.findIndex((col) => col.cards.some((c) => c.id === id));
      const [card] = draft[from].cards.splice(draft[from].cards.findIndex((c) => c.id === id), 1);
      draft[from + 1].cards.push(card);
    });

  return (
    <>
      <h1>Chore Chart</h1>
      <main class="board">
        <For each={board}>
          {(col) => (
            <section>
              <h2>{col.name} <small>{col.cards.length}</small></h2>
              <ul>
                <For each={col.cards}>
                  {(c) => (
                    <li class={{ starred: c.starred }}>
                      <span>{c.text}</span>
                      <button class="star" onClick={() => star(c.id)}>{c.starred ? '★' : '☆'}</button>
                      <Show when={col.id !== 'done'}>
                        <button class="move" onClick={() => moveOn(c.id)}>→</button>
                      </Show>
                    </li>
                  )}
                </For>
              </ul>
            </section>
          )}
        </For>
      </main>
    </>
  );
}
