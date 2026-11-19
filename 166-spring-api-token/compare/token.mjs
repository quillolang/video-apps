// What the provider gives the club's site for each API, and what it says when asked to revoke it:
//   node token.mjs        (the provider running: cd idp && node provider.mjs)
// For Spring's API (http://localhost:5100, a JWT) it prints the token's header and its claims' names, then the
// provider's whole answer to revoking it; for Quillo's (http://localhost:5101, an opaque token) its length and the
// revocation's answer.
const ISSUER = 'http://localhost:4000';
const site = 'Basic ' + Buffer.from('club-site:club-site-secret').toString('base64');
const post = (path, body) => fetch(ISSUER + path, { method: 'POST', headers: { authorization: site, 'content-type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(body) });
for (const api of ['http://localhost:5100', 'http://localhost:5101']) {
  const t = await (await post('/token', { grant_type: 'client_credentials', resource: api, scope: 'trails:read' })).json();
  console.log(`## a token for ${api}: ${t.token_type}, expires_in ${t.expires_in}`);
  if (t.access_token.split('.').length === 3) {
    const [h, p] = t.access_token.split('.').slice(0, 2).map((x) => JSON.parse(Buffer.from(x, 'base64url')));
    console.log(`header: ${JSON.stringify(h)}`);
    console.log(`claims: ${Object.keys(p).join(', ')} (aud ${JSON.stringify(p.aud)})`);
  } else console.log(`opaque: ${t.access_token.length} characters, no dots`);
  const rev = await post('/token/revocation', { token: t.access_token });
  console.log(`revoke it: ${rev.status} ${await rev.text()}`);
}
