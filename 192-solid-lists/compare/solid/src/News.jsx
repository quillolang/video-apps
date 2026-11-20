import { createMemo, Loading } from 'solid-js';

// A stand-in for a news API that's down.
const fetchNews = () =>
  new Promise((_, fail) => setTimeout(() => fail(new Error('503 Service Unavailable')), 500));

export default function News() {
  const news = createMemo(() => fetchNews());

  return (
    <main>
      <h1>Home</h1>
      <p>Welcome back!</p>
      <Loading fallback={<p>Loading the news…</p>}>
        <p>News: {news()}</p>
      </Loading>
    </main>
  );
}
