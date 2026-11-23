import { useState } from 'react';
import { ITEMS } from './items.js';
import { ran } from './count.js';
import './groceries.css';

const money = (cents) => `$${(cents / 100).toFixed(2)}`;

function Row({ item, onToggle, onRemove }) {
  ran('Row');
  return (
    <li className={item.done ? 'done' : ''}>
      <label>
        <input type="checkbox" checked={item.done} onChange={() => onToggle(item.id)} />
        <span className="name">{item.name}</span>
      </label>
      <span className="qty">×{item.qty}</span>
      <span className="price">{money(item.cents)}</span>
      <button className="remove" aria-label={`Remove ${item.name}`} onClick={() => onRemove(item.id)}>×</button>
    </li>
  );
}

export default function App() {
  ran('App');
  const [items, setItems] = useState(ITEMS);
  const [filter, setFilter] = useState('');
  const [draft, setDraft] = useState('');

  const shown = items.filter((i) => i.name.toLowerCase().includes(filter.toLowerCase()));
  const open = items.filter((i) => !i.done);
  const total = open.reduce((sum, i) => sum + i.cents * i.qty, 0);

  const toggle = (id) => setItems(items.map((i) => (i.id === id ? { ...i, done: !i.done } : i)));
  const remove = (id) => setItems(items.filter((i) => i.id !== id));
  const add = (e) => {
    e.preventDefault();
    if (!draft.trim()) return;
    const id = Math.max(0, ...items.map((i) => i.id)) + 1;
    setItems([...items, { id, name: draft.trim(), cents: 100, qty: 1, done: false }]);
    setDraft('');
  };

  return (
    <main className="groceries">
      <h1>Groceries</h1>
      <form className="add" onSubmit={add}>
        <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Add an item" aria-label="New item" />
        <button>Add</button>
      </form>
      <input className="filter" value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Filter" aria-label="Filter" />
      <p className="summary">{open.length} left · {money(total)}</p>
      <ul className="list">
        {shown.map((i) => <Row key={i.id} item={i} onToggle={toggle} onRemove={remove} />)}
      </ul>
    </main>
  );
}
