// Streamlit: after Faster (a fragment every 50 ms), is the note field (drawn after the fragment) still there? N fresh sessions.
//   node note-race.mjs <url> [n]
import { chromium } from 'playwright';
import fs from 'node:fs';
const [url, n = '10'] = process.argv.slice(2);
const b = await chromium.launch(); const out = [];
for (let i = 0; i < Number(n); i++) {
  const p = await b.newPage(); await p.goto(url, { waitUntil: 'networkidle' }); await p.waitForTimeout(1500);
  const bx = p.locator('[class*="box-timer"]'), note = bx.getByRole('textbox', { name: 'Note' });
  await bx.getByRole('button', { name: 'Start', exact: true }).click(); await p.waitForTimeout(1000);
  const before = await note.count();
  await bx.getByRole('button', { name: 'Faster', exact: true }).click(); await p.waitForTimeout(3000);
  out.push({ before, after: await note.count() }); await p.close();
}
await b.close();
fs.writeFileSync('runs/note-race.json', JSON.stringify(out) + '\n');
console.log(JSON.stringify(out), out.filter((x) => x.after === 0).length, 'of', out.length, 'lost the note');
