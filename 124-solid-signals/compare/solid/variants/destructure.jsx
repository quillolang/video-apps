import { createSignal, For } from 'solid-js';
import './App.css';

function Share({ people, each }) {
  return (
    <p class="share">
      {people} people pay <strong>${each.toFixed(2)}</strong> each
    </p>
  );
}

export default function App() {
  const [bill, setBill] = createSignal(60);
  const [tip, setTip] = createSignal(15);
  const [people, setPeople] = createSignal(2);
  const total = () => bill() * (1 + tip() / 100);

  return (
    <main>
      <h1>Tip Splitter</h1>
      <label>
        Bill $
        <input type="number" value={bill()} onInput={(e) => setBill(Number(e.target.value))} />
      </label>
      <div class="tips">
        <For each={[10, 15, 20]}>
          {(t) => <button class={{ on: tip() === t }} onClick={() => setTip(t)}>{t}%</button>}
        </For>
      </div>
      <div class="people">
        <button onClick={() => setPeople((p) => Math.max(1, p - 1))}>−</button>
        <span>{people()} people</span>
        <button onClick={() => setPeople((p) => p + 1)}>+</button>
      </div>
      <p class="total">Total: ${total().toFixed(2)}</p>
      <Share people={people()} each={total() / people()} />
    </main>
  );
}
