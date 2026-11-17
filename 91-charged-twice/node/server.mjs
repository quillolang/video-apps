// Bean There's Pay button, in plain Node: a charge for each POST.
import http from 'node:http';

const charges = [];
// SLOW=1: the card network takes 1.5 seconds, as it sometimes does.
const wait = process.env.SLOW ? 1500 : 0;

const page = `<body style="font: 22px system-ui; margin: 28px">
<h1>☕ Bean There</h1>
<button style="font: inherit" onclick="pay()">Pay $4.50</button>
<span id="note" style="margin-left: 12px"></span>
<script>
  // No answer in a second? Try again.
  async function pay() {
    for (let tries = 0; tries < 2; tries++) {
      try {
        const signal = AbortSignal.timeout(1000);
        const r = await fetch('/pay', { method: 'POST', signal });
        note.textContent = await r.text();
        return;
      } catch { note.textContent = 'No answer: trying again...'; }
    }
    note.textContent = 'Something went wrong. Please try again.';
  }
</script>`;

http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/pay') {
    charges.push(4.5);
    const n = charges.length;
    return setTimeout(() => res.end(`Paid: charge ${n}`), wait);
  }
  if (req.url === '/charges') return res.end(`charges: ${charges.length}`);
  res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
  res.end(page);
}).listen(process.env.PORT ?? 8081, () =>
  console.log('Bean There on http://localhost:8081'));
