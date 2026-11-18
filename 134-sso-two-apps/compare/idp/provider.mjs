// The club's OpenID Connect provider: oidc-provider on http://localhost:4000, with its development login
// page (any name and password), and four clients: the club's two sites, Trail Club and Photo Album, once in
// Express and once in Quillo, each on a host of its own (*.localhost, so no two share a cookie).
// The club's own sites skip the consent page.
//   node provider.mjs
import Provider from 'oidc-provider';

const site = (id, host, auth) => ({
  client_id: id, client_secret: `${id}-secret`, token_endpoint_auth_method: auth,
  // Its own host, and plain localhost on the same port: the trap the video shows (one cookie jar for both).
  redirect_uris: [`http://${host}/callback`, `http://localhost:${host.split(':')[1]}/callback`],
  post_logout_redirect_uris: [`http://${host}/`, `http://localhost:${host.split(':')[1]}/`],
});
const oidc = new Provider('http://localhost:4000', {
  clients: [
    site('trail-express', 'trail.localhost:3000', 'client_secret_basic'),
    site('photos-express', 'photos.localhost:3001', 'client_secret_basic'),
    site('trail-quillo', 'trail.localhost:8080', 'client_secret_post'),
    site('photos-quillo', 'photos.localhost:8081', 'client_secret_post'),
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
