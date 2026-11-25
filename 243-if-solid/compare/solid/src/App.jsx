import { createSignal, createEffect, Show, Switch, Match, For } from 'solid-js';
import './page.css';

const TODOS = [
  { id: 1, text: 'Milk', done: true },
  { id: 2, text: 'Bread', done: false },
  { id: 3, text: 'Eggs', done: false },
];

export default function App() {
  const [unread, setUnread] = createSignal(0);
  const [running, setRunning] = createSignal(false);
  const [speed, setSpeed] = createSignal(100);
  const [ticks, setTicks] = createSignal(0);
  const [showDone, setShowDone] = createSignal(false);
  const [joining, setJoining] = createSignal(false);

  createEffect(
    () => [running(), speed()],
    ([on, ms]) => {
      if (!on) return;
      const id = setInterval(() => setTicks((t) => t + 1), ms);
      return () => clearInterval(id);
    },
  );

  return (
    <main>
      <h1>Solid</h1>
      <section class="box box-if">
        <h2>Unread</h2>
        <button onClick={() => setUnread(unread() + 1)}>+1 unread</button>
        <button onClick={() => setUnread(0)}>Read all</button>
        <p class="out">
          <Switch fallback={<strong>{unread()} new messages</strong>}>
            <Match when={unread() === 0}><span>All read</span></Match>
            <Match when={unread() === 1}><span>1 new message</span></Match>
          </Switch>
        </p>
      </section>
      <section class="box box-timer">
        <h2>Ticker</h2>
        <button onClick={() => setRunning(!running())}>{running() ? 'Stop' : 'Start'}</button>
        <button onClick={() => setSpeed(speed() / 2)}>Faster</button>
        <p class="out">{ticks()} ticks</p>
        <Show when={running()}>
          <input placeholder="A note, while it runs" aria-label="Note" />
        </Show>
      </section>
      <section class="box box-list">
        <h2>Shopping</h2>
        <label><input type="checkbox" checked={showDone()} onChange={(e) => setShowDone(e.target.checked)} /> Show done</label>
        <ul>
          <For each={TODOS.filter((t) => showDone() || !t.done)}>{(t) => <li>{t.text}</li>}</For>
        </ul>
      </section>
      <section class="box box-one">
        <h2>Log in or sign up</h2>
        <button onClick={() => setJoining(!joining())}>{joining() ? 'I have an account' : "I'm new here"}</button>
        <input placeholder={joining() ? 'Work email' : 'Your email'} aria-label="Email" />
      </section>
    </main>
  );
}
