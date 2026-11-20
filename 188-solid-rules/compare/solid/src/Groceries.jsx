import { createStore, For } from 'solid-js';

export default function Groceries() {
  const [list, setList] = createStore({ items: ['milk', 'bread'] });

  return (
    <main>
      <h1>Groceries</h1>
      <ul>
        <For each={list.items}>{(item) => <li>{item}</li>}</For>
      </ul>
      <button onClick={() => list.items.push('eggs')}>Add eggs</button>
    </main>
  );
}
