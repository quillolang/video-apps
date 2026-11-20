import { createStore, For } from 'solid-js';

export default function Pantry() {
  const [pantry, setPantry] = createStore({ items: ['rice', 'tea'] });

  return (
    <main>
      <h1>Pantry</h1>
      <ul>
        <For each={pantry.items}>{(item) => <li>{item}</li>}</For>
      </ul>
      <button onClick={() => setPantry((s) => { s.items.push('jam'); })}>
        Add jam
      </button>
    </main>
  );
}
