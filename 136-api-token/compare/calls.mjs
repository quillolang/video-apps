// Calls each trails API (GET /api/trails) the same ways, and prints the status and the answer's error for each:
//   none      no token at all
//   good      a token the provider gave the club's site for this API (client credentials, this API as the resource)
//   other     a token of the same kind, but for the club's photos API (5102 for a JWT, 5103 for an opaque one)
//   forged    Express: the good JWT with its payload changed (sub "admin"), the signature kept; Quillo: random text
//   revoked   a fresh good token, revoked at the provider's revocation endpoint first (what it answered, too)
//   expired   a good token, after waiting until it expired (the provider's TTL for API tokens, plus a second)
// Then 20 good calls to each: the median time for one call, as this script saw it.
//   node calls.mjs express=http://localhost:5100 quillo=http://localhost:5101
const ISSUER = 'http://localhost:4000';
const site = 'Basic ' + Buffer.from('club-site:club-site-secret').toString('base64');
const post = (path, body) => fetch(ISSUER + path, { method: 'POST', headers: { authorization: site, 'content-type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(body) });
const tokenFor = async (api, scope = 'trails:read') => (await (await post('/token', { grant_type: 'client_credentials', resource: api, scope })).json());
const photosFor = (api) => api.replace(/510(\d)$/, (_, d) => `510${Number(d) + 2}`);
const call = async (api, token) => {
  const res = await fetch(`${api}/api/trails`, token ? { headers: { authorization: `Bearer ${token}` } } : {});
  const body = await res.json().catch(() => null);
  return { status: res.status, error: body?.error ?? null, why: body?.why ?? null, trails: Array.isArray(body) ? body.length : null };
};
const forge = (token, api) => {
  if (!token.includes('.')) return Buffer.from(crypto.getRandomValues(new Uint8Array(32))).toString('base64url');
  const [h, p, s] = token.split('.');
  const payload = JSON.parse(Buffer.from(p, 'base64url'));
  return [h, Buffer.from(JSON.stringify({ ...payload, sub: 'admin' })).toString('base64url'), s].join('.');
};
const apis = Object.fromEntries(process.argv.slice(2).map((a) => a.split('=')));
const names = Object.keys(apis);
const results = Object.fromEntries(names.map((n) => [n, {}]));
const tokens = {};
for (const n of names) tokens[n] = await tokenFor(apis[n]);
const ttl = Math.max(...Object.values(tokens).map((t) => t.expires_in));
for (const n of names) {
  const r = results[n];
  r.none = await call(apis[n], null);
  r.good = await call(apis[n], tokens[n].access_token);
  r.other = await call(apis[n], (await tokenFor(photosFor(apis[n]), 'photos:read')).access_token);
  r.forged = await call(apis[n], forge(tokens[n].access_token));
  const fresh = (await tokenFor(apis[n])).access_token;
  const rev = await post('/token/revocation', { token: fresh });
  r.revoked = { ...(await call(apis[n], fresh)), revocation: `${rev.status} ${(await rev.text()).slice(0, 80)}` };
  r.token_kind = tokens[n].access_token.includes('.') ? 'a signed JWT' : 'opaque';
  const times = [];
  for (let i = 0; i < 20; i++) { const t0 = performance.now(); await call(apis[n], tokens[n].access_token); times.push(performance.now() - t0); }
  r.ms = Math.round(times.sort((a, b) => a - b)[10] * 100) / 100;
}
await new Promise((ok) => setTimeout(ok, (ttl + 1) * 1000));
for (const n of names) results[n].expired = await call(apis[n], tokens[n].access_token);
results.ttl = ttl;
console.log(JSON.stringify(results, null, 1));
// And a table, on stderr, for people.
const W = [9, 62];
const cell = (c) => `${c.status}${c.trails != null ? ` ${c.trails} trails` : ''}${c.error ? ` ${c.error}` : ''}${c.why ? ` (${c.why})` : ''}`;
const row = (k, cells) => console.error(`${k.padEnd(W[0])}${cells.map((c, i) => (i < cells.length - 1 ? c.padEnd(W[1]) : c)).join('')}`);
row('', names.map((n) => `${n} (${results[n].token_kind})`));
for (const k of ['none', 'good', 'other', 'forged', 'revoked', 'expired']) row(k, names.map((n) => cell(results[n][k])));
row('one call', names.map((n) => `${results[n].ms} ms`));
for (const n of names) console.error(`revoking ${n}'s token: the provider answered ${results[n].revoked.revocation.slice(0, 66)}`);
