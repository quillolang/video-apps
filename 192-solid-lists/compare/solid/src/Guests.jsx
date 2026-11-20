import { createSignal } from 'solid-js';

export default function Guests() {
  const [names, setNames] = createSignal(['Ana', 'Ben']);
  const rename = (i, value) => setNames(names().map((n, j) => (j === i ? value : n)));

  return (
    <main>
      <h1>Guests</h1>
      {names().map((name, i) => (
        <input value={name} onInput={(e) => rename(i, e.target.value)} />
      ))}
      <p>Coming: {names().join(', ')}</p>
    </main>
  );
}
