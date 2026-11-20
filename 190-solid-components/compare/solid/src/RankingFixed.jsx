import { For } from 'solid-js';

const names = ['Ana', 'Ben', 'Cy'];

export default function Ranking() {
  return (
    <main>
      <h1>Ranking</h1>
      <ul class="plain">
        <For each={names}>{(name, i) => <li>{i() + 1}. {name}</li>}</For>
      </ul>
    </main>
  );
}
