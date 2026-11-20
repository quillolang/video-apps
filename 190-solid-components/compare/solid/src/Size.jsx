import { createSignal, onMount } from 'solid-js';

export default function Size() {
  const [width, setWidth] = createSignal(0);
  onMount(() => setWidth(window.innerWidth));

  return (
    <main>
      <h1>Size</h1>
      <p class="big">{width()} px</p>
    </main>
  );
}
