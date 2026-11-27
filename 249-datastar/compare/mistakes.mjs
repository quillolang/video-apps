// The same small mistakes made in both apps: what each tool says before it runs (go vet + go build,
// quillo check), and, when it runs, what the page does when Milk is added. Writes runs/mistakes.json.
import { chromium } from 'playwright';
import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const video = path.dirname(here);
const GO = path.resolve(here, '../../../.cache/go.sh');
const QUILLO = path.join(video, 'app', '.quillo', 'bin', 'quillo');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// [id, what, datastar: [from, to] in main.go, quillo: [from, to] in main.qwe]
const MISTAKES = [
  ['signal', 'a misspelled name in the page', ['data-show="$problem != \'\'" data-text="$problem"', 'data-show="$problme != \'\'" data-text="$problme"'],
    ['{problem && <p.problem>{problem}</p>}', '{problme && <p.problem>{problme}</p>}']],
  ['endpoint', 'a misspelled endpoint or function', ['@post(\'/add\')', '@post(\'/ad\')'], ['let r = add(item)', 'let r = ad(item)']],
  ['field', 'the page and the server name a field differently', ['Item string `json:"item"`', 'Item string `json:"name"`'],
    ['let r = add(item)', 'let r = add({ name: item })']],
  ['escape', 'HTML put together from text', null, null],
];

function copyDir(src, dst, skip = []) {
  fs.cpSync(src, dst, { recursive: true, filter: (p) => !skip.some((s) => p.includes(s)) });
}
const alive = new Set();
process.on('exit', () => { for (const p of alive) p.kill('SIGTERM'); });

async function play(url) {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 720, height: 504 } });
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errors.push(`${m.type()}: ${m.text()}`); });
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  await page.goto(url);
  await sleep(800);
  const name = process.env.ITEM || 'Milk';
  await page.fill('input[aria-label="New item"]', name);
  await page.click('button:has-text("Add")');
  await sleep(1200);
  const seen = await page.$eval('main', (m) => m.innerText);
  const bold = await page.$$eval('li b', (x) => x.length);
  const shot = path.join(os.tmpdir(), `ds-mistake-${Date.now()}.png`);
  await page.screenshot({ path: shot });
  await browser.close();
  return { page_text: seen, errors, bold };
}
async function serve(cmd, args, cwd, port) {
  const p = spawn(cmd, args, { cwd, stdio: 'ignore' });
  alive.add(p);
  for (let i = 0; i < 100; i++) { try { await fetch(`http://127.0.0.1:${port}/`); return p; } catch {} await sleep(100); }
  return p;
}

const out = {};
for (const [id, what, ds, qw] of MISTAKES) {
  const r = { what };
  // Datastar (Go)
  const dDir = fs.mkdtempSync(path.join(os.tmpdir(), `ds-${id}-`));
  copyDir(path.join(here, 'datastar'), dDir, ['list.db', 'shoplist']);
  let src = fs.readFileSync(path.join(dDir, 'main.go'), 'utf8').replace('127.0.0.1:8190', '127.0.0.1:8192');
  if (id === 'escape') {
    // The SDK's PatchElementf is fmt.Sprintf: the list written by hand with it, as quick examples do.
    src = src.replace('func renderList() string {', `func renderList() string {
	d := load()
	var b strings.Builder
	fmt.Fprintf(&b, "<div id=\\"list\\"><p>%d left</p><ul>", d.Left)
	for _, it := range d.Items {
		fmt.Fprintf(&b, "<li><label><input type=\\"checkbox\\" data-on:change=\\"@post('/toggle?id=%d')\\"> %s</label></li>", it.ID, it.Name)
	}
	b.WriteString("</ul></div>")
	return b.String()
}

func renderListTemplate() string {`).replace('import (\n\t"bytes"', 'import (\n\t"bytes"\n\t"fmt"');
  } else {
    if (!src.includes(ds[0])) throw new Error(`${id}: not in main.go: ${ds[0]}`);
    src = src.replace(ds[0], ds[1]);
  }
  fs.writeFileSync(path.join(dDir, 'main.go'), src);
  const vet = spawnSync(GO, ['vet', '.'], { cwd: dDir, encoding: 'utf8' });
  const build = spawnSync(GO, ['build', '-o', 'shoplist', '.'], { cwd: dDir, encoding: 'utf8' });
  r.datastar = { change: id === 'escape' ? 'renderList with fmt.Fprintf' : ds, vet: (vet.stdout + vet.stderr).trim(), vet_ok: vet.status === 0, build_ok: build.status === 0, build: (build.stdout + build.stderr).trim() };
  if (build.status === 0) {
    const p = await serve(path.join(dDir, 'shoplist'), [], dDir, 8192);
    process.env.ITEM = id === 'escape' ? '<b>Bold</b> beans' : id === 'signal' ? '   ' : 'Milk';
    r.datastar.run = await play('http://127.0.0.1:8192/');
    p.kill('SIGTERM'); alive.delete(p); await sleep(300);
  }
  // Quillo
  const qDir = fs.mkdtempSync(path.join(os.tmpdir(), `qw-${id}-`));
  copyDir(path.join(video, 'app'), qDir, ['list.db', '.quillo']);
  let q = fs.readFileSync(path.join(qDir, 'main.qwe'), 'utf8');
  if (id === 'escape') {
    r.quillo = { change: 'none needed: {i.name} is escaped; only raw() is not' };
  } else {
    if (!q.includes(qw[0])) throw new Error(`${id}: not in main.qwe: ${qw[0]}`);
    q = q.replace(qw[0], qw[1]);
    fs.writeFileSync(path.join(qDir, 'main.qwe'), q);
    const check = spawnSync(QUILLO, ['check', 'main.qwe'], { cwd: qDir, encoding: 'utf8' });
    r.quillo = { change: qw, check: (check.stdout + check.stderr).trim(), check_ok: check.status === 0 };
    if (check.status === 0) {
      const p = await serve(QUILLO, ['run', 'main.qwe', '--port', '8193'], qDir, 8193);
      process.env.ITEM = 'Milk';
      r.quillo.run = await play('http://127.0.0.1:8193/');
      p.kill('SIGTERM'); alive.delete(p); await sleep(300);
    }
  }
  out[id] = r;
  console.log(id, JSON.stringify(r, null, 1).slice(0, 2500));
}
fs.writeFileSync(path.join(here, 'runs', 'mistakes.json'), JSON.stringify(out, null, 2));
