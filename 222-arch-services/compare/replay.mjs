// Sends a call peek.mjs caught (logs/call-N.json) to billing again:  node compare/replay.mjs logs/call-1.json [--unsigned] [--amount N]
// --unsigned leaves the signature out; --amount N changes the body's 1200 to N, keeping the signature. Billing on 8251.
import fs from 'node:fs';
const args = process.argv.slice(2), file = args.find((a) => !a.startsWith('--') && !/^\d+$/.test(a));
const call = JSON.parse(fs.readFileSync(file)), headers = { ...call.headers };
delete headers['content-length'];
let body = call.body;
if (args.includes('--unsigned')) delete headers['x-quillo-service'];
const i = args.indexOf('--amount');
if (i >= 0) body = body.replace('1200', args[i + 1]);
const r = await fetch('http://127.0.0.1:8251' + call.url, { method: 'POST', headers, body });
console.log(r.status, await r.text());
