import { createSignal, Show, Switch, Match } from 'solid-js';
import './page.css';

function Counter() {
  const [n, setN] = createSignal(0);
  return (
    <div class="panel">
      <span class="count">Clicked {n()}</span>
      <button onClick={() => setN(n() + 1)}>+1</button>
    </div>
  );
}

export default function App() {
  const [open, setOpen] = createSignal(false);
  const [status, setStatus] = createSignal('loading');
  const [unread, setUnread] = createSignal(0);
  const [joining, setJoining] = createSignal(false);
  const [shown, setShown] = createSignal(true);
  const label = () => (open() ? 'Hide details' : 'Show details');
  return (
    <main>
      <h1>Solid</h1>
      <section class="box box-details">
        <h2>Details</h2>
        <button onClick={() => setOpen(!open())}>{label()}</button>
        <Show when={open()}>
          <p class="out">Ships in 2 days.</p>
        </Show>
      </section>
      <section class="box box-status">
        <h2>Status</h2>
        <button onClick={() => setStatus('loading')}>Loading</button>
        <button onClick={() => setStatus('error')}>Error</button>
        <button onClick={() => setStatus('ready')}>Ready</button>
        <p class="out">
          <Switch fallback={<span>3 messages</span>}>
            <Match when={status() === 'loading'}><em>Loading…</em></Match>
            <Match when={status() === 'error'}><strong>Couldn't load</strong></Match>
          </Switch>
        </p>
      </section>
      <section class="box box-zero">
        <h2>Unread</h2>
        <button onClick={() => setUnread(unread() + 1)}>+1 unread</button>
        <button onClick={() => setUnread(0)}>Read all</button>
        <p class="out">Inbox<Show when={unread() > 0}><span class="badge">{unread()} new</span></Show></p>
      </section>
      <section class="box box-switch wide">
        <h2>Log in or sign up</h2>
        <button onClick={() => setJoining(!joining())}>{joining() ? 'I have an account' : "I'm new here"}</button>
        <Show when={joining()} fallback={<input placeholder="Your email" aria-label="Your email" />}>
          <input placeholder="Work email" aria-label="Work email" />
        </Show>
      </section>
      <section class="box box-keep">
        <h2>Counter</h2>
        <button onClick={() => setShown(!shown())}>{shown() ? 'Hide counter' : 'Show counter'}</button>
        <Show when={shown()}>
          <Counter />
        </Show>
      </section>
    </main>
  );
}
