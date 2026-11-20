import { createSignal } from 'solid-js';

export default function Welcome() {
  const [user, setUser] = createSignal(null);

  if (!user()) {
    return (
      <main>
        <h1>Welcome</h1>
        <button onClick={() => setUser('Ana')}>Log in as Ana</button>
      </main>
    );
  }
  return (
    <main>
      <h1>Welcome</h1>
      <p class="big">Hi, {user()}!</p>
    </main>
  );
}
