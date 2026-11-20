import { createSignal, Show } from 'solid-js';

export default function Profile() {
  const [user, setUser] = createSignal({ name: 'Ana' });

  return (
    <main>
      <h1>Profile</h1>
      <Show when={user()} fallback={<p>Nobody here</p>}>
        {(u) => <p class="big">Hi, {u.name}!</p>}
      </Show>
      <button onClick={() => setUser({ name: 'Ben' })}>Switch to Ben</button>
    </main>
  );
}
