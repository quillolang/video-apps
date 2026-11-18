// Asks a running app to crack a billion cookies, and 0.3 seconds later, as another visitor, for its home page: how long
// each one waited, and what came back.
//   node crack.mjs <port>
const base = `http://localhost:${process.argv[2]}`;
const timed = async (path) => {
  const t = performance.now();
  const r = await fetch(base + path);
  const body = (await r.text()).trim();
  return { status: r.status, secs: ((performance.now() - t) / 1000).toFixed(1), body };
};
const crack = timed('/crack?n=1000000000');
await new Promise((r) => setTimeout(r, 300));
const page = await timed('/');
const c = await crack;
console.log(`a billion cookies: ${c.status} after ${c.secs} s (${c.status === 200 ? c.body : c.body.slice(0, 40)})`);
console.log(`the home page, asked 0.3 s in: ${page.status} after ${page.secs} s`);
