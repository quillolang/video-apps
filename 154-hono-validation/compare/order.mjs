// Posts one order to a running app, as the form does, and prints what comes back: the status, and what the page says
// (the thanks, or each message by its field), or, when it isn't the page, the answer itself, cut to fit one line.
//   node order.mjs <name> <port> [field=value ...]      (the rest of the order: Ada, ada@example.com, 2 loaves, 2026-11-21)
const [name, port, ...pairs] = process.argv.slice(2);
const order = { name: 'Ada', email: 'ada@example.com', loaves: '2', pickup: '2026-11-21' };
for (const p of pairs) { const i = p.indexOf('='); order[p.slice(0, i)] = p.slice(i + 1); }
const base = `http://localhost:${port}`;
const res = await fetch(base + '/order', { method: 'POST', body: new URLSearchParams(order), headers: { origin: base } });
const body = await res.text();
const text = (h) => h.replace(/<[^>]+>/g, '').trim();
let says;
if (/<h1>Thanks/.test(body)) says = text(body.match(/<h1>(.*?)<\/h1>/s)[1]);
else if (/<form/.test(body)) {
  const bad = [...body.matchAll(/<label>(\w+) <input[^>]*><\/label><strong[^>]*>\s*([^<]*)<\/strong>/g)].map((m) => `${m[1]}: ${m[2]}`);
  says = bad.length ? `the form again. ${bad.join('; ')}` : 'the form again, with no message';
} else says = body.replace(/\s*\n\s*/g, ' ').trim();   // as it came, on one line
const line = `${name.padEnd(8)}${res.status}  ${says}`;
console.log(line.length > 116 ? line.slice(0, 115) + '…' : line);
