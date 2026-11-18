// 100,000 visits to a running app's home page, 200 at a time, then asks it how many it counted:
//   node load.mjs <port> [visits] [at once]
const [port, total = 100000, conc = 200] = process.argv.slice(2).map(Number);
const base = `http://localhost:${port}`;
const before = Number(await (await fetch(base + '/hits')).text());
let sent = 0, failed = 0;
const t = performance.now();
const worker = async () => {
  while (sent < total) {
    sent++;
    try { const r = await fetch(base + '/'); await r.text(); if (!r.ok) failed++; } catch { failed++; }
  }
};
await Promise.all(Array.from({ length: conc }, worker));
const secs = (performance.now() - t) / 1000;
const counted = Number(await (await fetch(base + '/hits')).text()) - before;
console.log(`${total.toLocaleString('en')} visits, ${conc} at a time, in ${secs.toFixed(1)} s (${Math.round(total / secs).toLocaleString('en')} a second)${failed ? `, ${failed} failed` : ''}`);
console.log(`counted: ${counted.toLocaleString('en')}${counted === total ? ', every one' : `: ${(total - counted).toLocaleString('en')} lost`}`);
