import { createSignal } from 'solid-js';

function Price(props) {
  return <p class="big">${props.amount}</p>;
}

export default function Cart() {
  const [qty, setQty] = createSignal(1);

  return (
    <main>
      <h1>Cart</h1>
      <p>{qty()} × $5</p>
      <Price amount={qty() * 5} />
      <button onClick={() => setQty(qty() + 1)}>One more</button>
    </main>
  );
}
