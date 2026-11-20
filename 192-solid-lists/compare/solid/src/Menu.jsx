import { createMemo, For } from 'solid-js';

// A stand-in for an API that takes two seconds.
const fetchMenu = () => new Promise((done) => setTimeout(() => done(['Soup', 'Pie']), 2000));

export default function Menu() {
  const menu = createMemo(() => fetchMenu());

  return (
    <main>
      <h1>Menu</h1>
      <p>Welcome! Today we have:</p>
      <ul>
        <For each={menu()}>{(dish) => <li>{dish}</li>}</For>
      </ul>
    </main>
  );
}
