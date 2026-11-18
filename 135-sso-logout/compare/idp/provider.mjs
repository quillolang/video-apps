// The club's OpenID Connect provider: oidc-provider on http://localhost:4000, with its development login
// page (any name and password), and four clients: the club's two sites, Trail Club and Photo Album, once in
// Express and once in Quillo, each on a host of its own (*.localhost, so no two share a cookie).
// The club's own sites skip the consent page; the Express ones take back-channel logout notices.
//   node provider.mjs
import Provider from 'oidc-provider';

const site = (id, host, auth, backchannel) => ({
  client_id: id, client_secret: `${id}-secret`, token_endpoint_auth_method: auth,
  // A site that takes the provider's logout notices: it posts one there when you log out everywhere.
  ...(backchannel && {
    backchannel_logout_uri: `http://${host}/backchannel-logout`, backchannel_logout_session_required: true,
  }),
  redirect_uris: [`http://${host}/callback`], post_logout_redirect_uris: [`http://${host}/`],
});
const oidc = new Provider('http://localhost:4000', {
  clients: [
    site('trail-express', 'trail.localhost:3000', 'client_secret_basic', true),
    site('photos-express', 'photos.localhost:3001', 'client_secret_basic', true),
    site('trail-quillo', 'trail.localhost:8080', 'client_secret_post'),
    site('photos-quillo', 'photos.localhost:8081', 'client_secret_post'),
  ],
  // Whoever logs in on the development page is that account: its name, with a capital letter.
  findAccount: (ctx, id) => ({
    accountId: id, claims: () => ({ sub: id, name: id[0].toUpperCase() + id.slice(1) }),
  }),
  claims: { openid: ['sub'], profile: ['name'] },
  cookies: { keys: ['videos-only-cookie-key'] },
  features: { backchannelLogout: { enabled: true } },
  // oidc-provider won't send requests to addresses on this machine (its SSRF guard): the sites are on this machine,
  // so for this local test only, its requests go out without the guard.
  fetch: (url, { dispatcher, ...options }) => fetch(url, options),
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
