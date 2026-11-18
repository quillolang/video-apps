// The club's OpenID Connect provider: oidc-provider on http://localhost:4000, with its development login
// page (any name and password), and two clients: Trail Club in Go and in Quillo, each on a host of its own
// (trail.localhost, its own port). The club's own sites skip the consent page.
//   node provider.mjs
import Provider from 'oidc-provider';

const site = (id, host, auth, callback = '/callback') => ({
  client_id: id, client_secret: `${id}-secret`, token_endpoint_auth_method: auth,
  redirect_uris: [`http://${host}${callback}`],
  post_logout_redirect_uris: [`http://${host}/`],
});
const oidc = new Provider('http://localhost:4000', {
  clients: [
    site('trail-go', 'trail.localhost:8092', 'client_secret_basic'),
    site('trail-quillo', 'trail.localhost:8080', 'client_secret_post'),
  ],
  // Whoever logs in on the development page is that account: its name, with a capital letter.
  findAccount: (ctx, id) => ({
    accountId: id, claims: () => ({ sub: id, name: id[0].toUpperCase() + id.slice(1) }),
  }),
  claims: { openid: ['sub'], profile: ['name'] },
  cookies: { keys: ['videos-only-cookie-key'] },
  // The club's own sites: the profile is granted at once, with no consent page.
  async loadExistingGrant(ctx) {
    const { client, session, result, provider } = ctx.oidc;
    const grantId = result?.consent?.grantId || session.grantIdFor(client.clientId);
    if (grantId) return provider.Grant.find(grantId);
    const grant = new provider.Grant({ clientId: client.clientId, accountId: session.accountId });
    grant.addOIDCScope('openid profile');
    await grant.save();
    return grant;
  },
});
oidc.listen(4000, () => console.log('provider on http://localhost:4000'));
