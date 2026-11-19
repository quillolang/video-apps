import { createSignal } from 'solid-js';

export default function App() {
  const [count, setCount] = createSignal(0);
  const doubled = count() * 2;

  return (
    <>
      <button
        onClick={() => setCount((c) => c + 1)}
      >
        {doubled}
      </button>
      <p>{count()} doubled is {doubled}</p>
    </>
  );
}
