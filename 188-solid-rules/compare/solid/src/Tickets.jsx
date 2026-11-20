import { createSignal, createEffect } from 'solid-js';

export default function Tickets() {
  const [qty, setQty] = createSignal(1);
  const [total, setTotal] = createSignal(5);

  createEffect(() => setTotal(qty() * 5));

  return (
    <main>
      <h1>Tickets</h1>
      <p>{qty()} × $5</p>
      <p class="big">${total()}</p>
      <button onClick={() => setQty(qty() + 1)}>One more</button>
    </main>
  );
}
