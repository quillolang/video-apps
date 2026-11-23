// The same page as app/main.qwe, for scale: Express 5 on Node 24, the count in node:sqlite (built into Node),
// and the button's script written by hand.
import express from 'express';
import { DatabaseSync } from 'node:sqlite';

const db = new DatabaseSync('app.db');
db.exec('create table if not exists likes (id integer primary key, n integer not null)');
db.exec('insert or ignore into likes (id, n) values (1, 0)');
const likes = () => db.prepare('select n from likes where id = 1').get().n;

const app = express();
app.post('/like', (req, res) => {
  db.prepare('update likes set n = n + 1 where id = 1').run();
  res.json(likes());
});
app.get('/', (req, res) => {
  res.send(`<!doctype html><html><head><title>One binary</title></head>
<body style="font: 22px system-ui; margin: 2rem">
<h1>Hello from one binary</h1>
<p>This page, its button and its database come from one program.</p>
<button id="like">♥ ${likes()}</button>
<script>
document.getElementById('like').onclick = async (e) => {
  const n = await (await fetch('/like', { method: 'POST' })).json();
  e.target.textContent = '♥ ' + n;
};
</script></body></html>`);
});
app.listen(process.env.PORT || 3000, '127.0.0.1');
