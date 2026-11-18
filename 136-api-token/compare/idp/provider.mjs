// The club's OpenID Connect provider (oidc-provider, on http://localhost:4000), and the club's trails API,
// twice: in Express (localhost:5100) and in Quillo (localhost:5101). The club's site asks for a token for one
// API (client credentials, with that API as the resource). Express's API gets signed JWT access tokens, which
// it checks itself; Quillo's gets opaque ones, which it asks the provider about (introspection).
// Tokens for the APIs live TTL seconds (8 by default here, so the video can watch one expire).
//   node provider.mjs
import Provider from 'oidc-provider';

const TTL = Number(process.env.TTL ?? 8);
// Each API, by its address: the scope it takes, and the kind of token it gets.
const api = (port, scope, format) => [`http://localhost:${port}`,
  { scope, audience: `http://localhost:${port}`, accessTokenFormat: format, accessTokenTTL: TTL }];
const apis = Object.fromEntries([
  api(5100, 'trails:read', 'jwt'),
  api(5101, 'trails:read', 'opaque'),
  // The club's photos API, each kind: a token for it is the right kind, but for another API.
  api(5102, 'photos:read', 'jwt'),
  api(5103, 'photos:read', 'opaque'),
]);
const oidc = new Provider('http://localhost:4000', {
  clients: [
    // The club's site, which calls the APIs; and Quillo's API, which asks about the tokens it's given.
    { client_id: 'club-site', client_secret: 'club-site-secret', grant_types: ['client_credentials'],
      redirect_uris: [], response_types: [] },
    { client_id: 'trails-api-quillo', client_secret: 'trails-api-quillo-secret', grant_types: [],
      redirect_uris: [], response_types: [] },
  ],
  features: {
    clientCredentials: { enabled: true },
    introspection: { enabled: true },
    revocation: { enabled: true },
    resourceIndicators: {
      enabled: true,
      defaultResource: () => undefined,
      useGrantedResource: () => true,
      getResourceServerInfo: (ctx, resource) => {
        if (apis[resource]) return apis[resource];
        throw new Error(`no such API: ${resource}`);
      },
    },
  },
  cookies: { keys: ['videos-only-cookie-key'] },
});
oidc.listen(4000, () => console.log('provider on http://localhost:4000'));
