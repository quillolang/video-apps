// The same routes as app/main.qwe, in Express 5 on Node 24, for scale.
import express from 'express';
import { setTimeout as sleep } from 'node:timers/promises';

let hits = 0;
function spin(ms) {                        // only computes, for ms milliseconds
  const start = Date.now();
  let rounds = 0;
  while (Date.now() - start < ms) rounds += 1;
  return rounds;
}

const app = express();
app.get('/fast', (req, res) => res.send('fast'));
app.get('/slow', async (req, res) => { await sleep(1000); res.send('slow'); });
app.get('/busy', (req, res) => res.send(`spun ${spin(800)} rounds`));
app.get('/both', async (req, res) => res.send(`${(await Promise.all([spin(800), spin(800)])).length} spins`));
// a slow API: 1 s
app.get('/weather', async (req, res) => res.send(await (await fetch('http://127.0.0.1:8242/')).text()));
app.get('/count', (req, res) => { hits += 1; res.json(hits); });
app.get('/lost', async (req, res) => {
  const seen = hits;
  await sleep(5);
  hits = seen + 1;
  res.json(hits);
});
app.get('/safe', async (req, res) => {
  await sleep(5);
  hits += 1;
  res.json(hits);
});
app.listen(process.env.PORT || 3000, '127.0.0.1');
