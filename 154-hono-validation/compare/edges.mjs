// The same odd values sent to both running apps, Hono (8090) and Quillo (8080), one field changed each time, and what
// each one does with it: takes the order (and how many loaves it took), or gives that field's message.
//   node edges.mjs
const tries = [['loaves', '1e1'], ['loaves', '0x0A'], ['loaves', '02'], ['loaves', '2.5'], ['email', 'a@b.c'],
  ['pickup', '2026-02-29'], ['name', '   ']];
const send = async (port, field, value) => {
  const base = `http://localhost:${port}`;
  const order = { name: 'Ada', email: 'ada@example.com', loaves: '2', pickup: '2026-11-21', [field]: value };
  const body = await (await fetch(base + '/order', { method: 'POST', body: new URLSearchParams(order), headers: { origin: base } })).text();
  const thanks = body.match(/<h1>Thanks, [^!]*! (\d+) loa/);
  if (thanks) return `ordered: ${thanks[1]} ${thanks[1] === '1' ? 'loaf' : 'loaves'}`;
  const bad = body.match(/<strong[^>]*>\s*([^<]*)<\/strong>/);
  return bad ? `"${bad[1]}"` : 'the form, no message';
};
console.log(`${'sent'.padEnd(22)}${'Hono (Zod)'.padEnd(30)}Quillo`);
for (const [field, value] of tries) {
  const [h, q] = [await send(8090, field, value), await send(8080, field, value)];
  console.log(`${`${field}="${value}"`.padEnd(22)}${h.padEnd(30)}${q}`);
}
