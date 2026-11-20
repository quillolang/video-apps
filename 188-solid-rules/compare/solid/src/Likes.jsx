import { createSignal } from 'solid-js';

export default function Likes() {
  const [likes, setLikes] = createSignal(0);

  return (
    <main>
      <h1>Likes</h1>
      <p class="big">{likes()}</p>
      <button onclick={() => setLikes(likes() + 1)}>Like</button>
    </main>
  );
}
