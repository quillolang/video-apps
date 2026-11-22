import Total from './Total';
import './news.css';

export default function Checkout() {
  return (
    <main>
      <h1>Checkout</h1>
      <Total price={12.5} />
      <form method="post" action="/pay">
        <label>Card number <input id="card" name="card" autoComplete="off" /></label>
        <label>Expiry <input name="expiry" placeholder="MM/YY" /></label>
        <button>Pay</button>
      </form>
      <section id="reviews"><p>Loading reviews…</p></section>
      <script src="http://127.0.0.1:9900/reviews.js" async></script>
    </main>
  );
}
