// Six kinds of state on one page, each with a +1.
import { createSignal, onCleanup } from 'solid-js';
import { createRouter, useSearchParams } from '@solidjs/router';
import './App.css';

function Home() {
  const [tab, setTab] = createSignal(0);

  const [search] = useSearchParams();
  const address = () => Number(search.n ?? 0);

  // The counts the server keeps: /api/<id> reads one, a POST adds one.
  const [counts, setCounts] = createSignal({ visitor: 0, everyone: 0, saved: 0, synced: 0 });
  const set = (id, n) => setCounts((c) => ({ ...c, [id]: n }));
  for (const id of ['visitor', 'everyone', 'saved', 'synced']) {
    fetch(`/api/${id}`).then((r) => r.json()).then((n) => set(id, n));
  }
  const add = async (id) => set(id, await fetch(`/api/${id}`, { method: 'POST' }).then((r) => r.json()));

  // Kept in sync: the server sends every new synced count, over server-sent events.
  const events = new EventSource('/api/synced/events');
  events.onmessage = (e) => set('synced', Number(e.data));
  onCleanup(() => events.close());

  return (
    <>
      <h1>Where state lives</h1>
      <button id="tab" onClick={() => setTab(tab() + 1)}>This tab: {tab()}</button>
      <a id="address" href={`/?n=${address() + 1}`}>The address: {address()}</a>
      <button id="visitor" onClick={() => add('visitor')}>This visitor: {counts().visitor}</button>
      <button id="everyone" onClick={() => add('everyone')}>Everyone, until a restart: {counts().everyone}</button>
      <button id="saved" onClick={() => add('saved')}>Everyone, for good: {counts().saved}</button>
      <button id="synced" onClick={() => add('synced')}>Kept in sync: {counts().synced}</button>
    </>
  );
}

const Router = createRouter({ routes: [{ path: '/', component: Home }] });

export default function App() {
  return <Router>{(props) => props.children}</Router>;
}
