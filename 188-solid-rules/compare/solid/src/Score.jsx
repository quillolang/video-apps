import { createSignal } from 'solid-js';

export default function Score() {
  const [score, setScore] = createSignal(0);

  function addTwo() {
    setScore(score() + 1);
    setScore(score() + 1);
  }

  return (
    <main>
      <h1>Score</h1>
      <p class="big">{score()}</p>
      <button onClick={addTwo}>+2</button>
    </main>
  );
}
