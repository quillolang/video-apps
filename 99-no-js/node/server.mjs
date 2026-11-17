// Pip's Recipes, in plain Node: an empty page, filled in by its script.
import http from 'node:http';

const RECIPES = ['Banana bread', 'Lemon tart',
  'Mushroom risotto', 'Tomato soup'];

const page = `<body style="font: 22px system-ui; margin: 28px">
<div id="root"></div>
<script>
  async function show(q) {
    const r = await fetch('/api/recipes?q=' + encodeURIComponent(q));
    const items = (await r.json()).map((n) => '<li>' + n + '</li>');
    root.innerHTML = "<h1>🍰 Pip's Recipes</h1>"
      + '<form id="find"><input name="q"> <button>Find</button></form>'
      + '<ul>' + items.join('') + '</ul>';
    find.q.value = q;
    find.onsubmit = (e) => { e.preventDefault(); show(find.q.value); };
  }
  show('');
</script>`;

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  if (url.pathname === '/api/recipes') {
    const q = (url.searchParams.get('q') ?? '').toLowerCase();
    const found = RECIPES.filter((r) => r.toLowerCase().includes(q));
    res.writeHead(200, { 'content-type': 'application/json' });
    return res.end(JSON.stringify(found));
  }
  res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
  res.end(page);
}).listen(process.env.PORT ?? 8081, () =>
  console.log("Pip's Recipes on http://localhost:8081"));
