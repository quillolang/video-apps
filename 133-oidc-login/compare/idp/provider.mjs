// A local OpenID Connect provider for the videos: oidc-provider on http://localhost:4000, with its development login
// page (any name and password) and consent page, and one client for each app.
//   node provider.mjs            (PORT, and each client's port, can be changed: see below)
import Provider from 'oidc-provider';

const PORT = Number(process.env.PORT ?? 4000);
const app = (id, port, auth) => ({
  client_id: id, client_secret: `${id}-secret`, token_endpoint_auth_method: auth,
  redirect_uris: [`http://localhost:${port}/callback`], post_logout_redirect_uris: [`http://localhost:${port}/`],
});
const oidc = new Provider(`http://localhost:${PORT}`, {
  clients: [
    app('express-app', process.env.EXPRESS_PORT ?? 3000, 'client_secret_basic'),
    app('quillo-app', process.env.QUILLO_PORT ?? 8080, 'client_secret_post'),
  ],
  // Whoever logs in on the development page is that account: its name, with a capital letter.
  findAccount: (ctx, id) => ({ accountId: id, claims: () => ({ sub: id, name: id[0].toUpperCase() + id.slice(1) }) }),
  claims: { openid: ['sub'], profile: ['name'] },
  cookies: { keys: ['videos-only-cookie-key'] },
});
oidc.listen(PORT, () => console.log(`provider on http://localhost:${PORT}`));
