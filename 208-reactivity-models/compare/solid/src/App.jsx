import { createSignal, createMemo, createStore, For } from 'solid-js';
import { ITEMS } from './items.js';
import { ran } from './count.js';
import './groceries.css';

const money = (cents) => `$${(cents / 100).toFixed(2)}`;

function Row(props) {
  ran('Row');
  return (
    <li class={{ done: props.item.done }}>
      <label>
        <input type="checkbox" checked={props.item.done} onChange={() => props.onToggle(props.item.id)} />
        <span class="name">{props.item.name}</span>
      </label>
      <span class="qty">×{props.item.qty}</span>
      <span class="price">{money(props.item.cents)}</span>
      <button class="remove" aria-label={`Remove ${props.item.name}`} onClick={() => props.onRemove(props.item.id)}>×</button>
    </li>
  );
}

export default function App() {
  ran('App');
  const [items, setItems] = createStore(ITEMS.map((i) => ({ ...i })));
  const [filter, setFilter] = createSignal('');
  const [draft, setDraft] = createSignal('');

  const shown = createMemo(() => items.filter((i) => i.name.toLowerCase().includes(filter().toLowerCase())));
  const open = createMemo(() => items.filter((i) => !i.done));
  const total = createMemo(() => open().reduce((sum, i) => sum + i.cents * i.qty, 0));

  const toggle = (id) => setItems((s) => { const item = s.find((i) => i.id === id); item.done = !item.done; });
  const remove = (id) => setItems((s) => { s.splice(s.findIndex((i) => i.id === id), 1); });
  const add = (e) => {
    e.preventDefault();
    const name = draft().trim();
    if (!name) return;
    const id = Math.max(0, ...items.map((i) => i.id)) + 1;
    setItems((s) => { s.push({ id, name, cents: 100, qty: 1, done: false }); });
    setDraft('');
  };

  return (
    <main class="groceries">
      <h1>Groceries</h1>
      <form class="add" onSubmit={add}>
        <input value={draft()} onInput={(e) => setDraft(e.target.value)} placeholder="Add an item" aria-label="New item" />
        <button>Add</button>
      </form>
      <input class="filter" value={filter()} onInput={(e) => setFilter(e.target.value)} placeholder="Filter" aria-label="Filter" />
      <p class="summary">{open().length} left · {money(total())}</p>
      <ul class="list">
        <For each={shown()}>{(item) => <Row item={item} onToggle={toggle} onRemove={remove} />}</For>
      </ul>
    </main>
  );
}
