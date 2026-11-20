import { createSignal, Show } from 'solid-js';

export default function Welcome() {
  const [user, setUser] = createSignal(null);

  return (
    <main>
      <h1>Welcome</h1>
      <Show
        when={user()}
        fallback={<button onClick={() => setUser('Ana')}>Log in as Ana</button>}
      >
        <p class="big">Hi, {user()}!</p>
      </Show>
    </main>
  );
}
