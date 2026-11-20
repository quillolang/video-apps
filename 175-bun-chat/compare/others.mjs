// A program, not a page, talking to the chat while Ana's tab is open. Ana says "hi bot" a second in, while the
// program listens.
//   node others.mjs bun <out.json>     chat/ (index.ts) on 3000; the program: bun talk.ts "hi from the terminal"
//   node others.mjs quillo <out.json>  ../app (main.qwe, with POST /say) on 8175; the program: curl -d ... /say
// What the program printed (copied from the run, as a terminal shows it) and Ana's tab go in <out.json>.
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const chat = path.join(here, 'chat'), app = path.join(here, '..', 'app');
const SIDES = {
  bun: { cwd: chat, cmd: 'bun', args: ['index.ts'], env: { NODE_ENV: 'production' }, url: 'http://localhost:3000',
         program: ['bun', ['talk.ts', 'hi from the terminal'], chat], shown: 'bun talk.ts "hi from the terminal"' },
  quillo: { cwd: app, cmd: path.join(app, '.quillo/bin/quillo'), args: ['run', 'main.qwe', '--port', '8175'], env: {}, url: 'http://localhost:8175',
            program: ['curl', ['-si', '-d', 'name=Bot', '-d', 'text=hi from the terminal', 'localhost:8175/say'], here],
            shown: 'curl -si -d name=Bot -d "text=hi from the terminal" localhost:8175/say' },
};
const [side, outFile] = process.argv.slice(2);
const S = SIDES[side];
if (!S || !outFile) { console.error('usage: node others.mjs bun|quillo <out.json>'); process.exit(2); }
let server = null;
const stop = () => new Promise((r) => { if (!server || server.exitCode != null) return r(); server.on('exit', r); try { process.kill(-server.pid, 'SIGTERM'); } catch { r(); } });
process.on('exit', () => { if (server && server.exitCode == null) { try { process.kill(-server.pid, 'SIGKILL'); } catch {} } });
for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => process.exit(1));
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

server = spawn(S.cmd, S.args, { cwd: S.cwd, env: { ...process.env, ...S.env }, stdio: 'ignore', detached: true });
for (let i = 0; ; i++) { try { if ((await fetch(S.url + '/')).ok) break; } catch {} if (i > 300) throw new Error(`nothing at ${S.url}`); await wait(50); }
const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 480, height: 300 } })).newPage();
await page.goto(S.url + '/'); await page.locator('input').first().fill('Ana'); await wait(1500);

const [cmd, args, cwd] = S.program;
const child = spawn(cmd, args, { cwd });
let printed = '';
child.stdout.on('data', (d) => { printed += d; }); child.stderr.on('data', (d) => { printed += d; });
const done = new Promise((r) => child.on('exit', r));
await wait(1000);
await page.locator('input').nth(1).fill('hi bot'); await page.locator('button').click();
const code = await done; await wait(500);
const tab = (await page.locator('li').allInnerTexts()).map((s) => s.trim());
await browser.close(); await stop();
const lines = printed.replace(/\r/g, '').trimEnd().split('\n').filter((l) => !/^date: /i.test(l));
console.log(`$ ${S.shown}\n${lines.join('\n')}\n(exit ${code})\nAna's tab: ${JSON.stringify(tab)}`);
fs.writeFileSync(outFile, JSON.stringify({ side, when: new Date().toString(), command: S.shown, printed: lines, exit: code, tab }, null, 1) + '\n');
