import { createSignal, For } from 'solid-js';

// The team, as an API gives it: new objects on every call.
const load = () => [{ id: 1, name: 'Ana' }, { id: 2, name: 'Ben' }];

export default function Team() {
  const [team, setTeam] = createSignal(load());

  return (
    <main>
      <h1>Team</h1>
      <For each={team()} keyed={(m) => m.id}>
        {(m) => <label>{m().name} <input placeholder="A note" /></label>}
      </For>
      <button onClick={() => setTeam(load())}>Refresh</button>
    </main>
  );
}
