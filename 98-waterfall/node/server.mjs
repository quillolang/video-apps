// Ada's dashboard, in plain Node: a page, and three APIs it calls.
import http from 'node:http';

// Each API takes 400 ms, as a real one might.
const wait = (ms) => new Promise((done) => setTimeout(done, ms));
const API = {
  '/api/me': () => ({ id: 7, name: 'Ada' }),
  '/api/orders': () => ['Margherita', 'Funghi'],
  '/api/picks': () => ['Diavola'],
};

const page = `<body style="font: 22px system-ui; margin: 28px">
<main id="main">⏳ Loading...</main>
<script>
  (async () => {
    const get = async (url) => (await fetch(url)).json();
    const me = await get('/api/me');
    const orders = await get('/api/orders?user=' + me.id);
    const picks = await get('/api/picks?user=' + me.id);
    main.innerHTML = '<h2>Hi, ' + me.name + '!</h2>'
      + '<p>Your orders: ' + orders.join(', ') + '</p>'
      + '<p>Try: ' + picks.join(', ') + '</p>';
  })();
</script>`;

http.createServer(async (req, res) => {
  const api = API[new URL(req.url, 'http://x').pathname];
  if (api) {
    await wait(400);
    res.writeHead(200, { 'content-type': 'application/json' });
    return res.end(JSON.stringify(api()));
  }
  res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
  res.end(page);
}).listen(process.env.PORT ?? 8081, () =>
  console.log("Ada's dashboard on http://localhost:8081"));
