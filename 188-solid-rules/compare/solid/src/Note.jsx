import { createSignal } from 'solid-js';

export default function Note() {
  const [editing, setEditing] = createSignal(false);
  const [ran, setRan] = createSignal([]);

  const edit = () => { setEditing(true); setRan([...ran(), 'edit']); };
  const save = () => { setEditing(false); setRan([...ran(), 'save']); };

  return (
    <main>
      <h1>Note</h1>
      <p class="big">{editing() ? 'Editing…' : 'Saved'}</p>
      <p>Ran: {ran().join(', ')}</p>
      <button onClick={editing() ? save : edit}>
        {editing() ? 'Save' : 'Edit'}
      </button>
    </main>
  );
}
