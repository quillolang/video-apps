import { createSignal, onSettled } from 'solid-js';

export default function Size() {
  const [width, setWidth] = createSignal(0);
  onSettled(() => {
    setWidth(window.innerWidth);
  });

  return (
    <main>
      <h1>Size</h1>
      <p class="big">{width()} px</p>
    </main>
  );
}
