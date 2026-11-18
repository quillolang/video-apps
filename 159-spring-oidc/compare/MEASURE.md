# OpenID Connect login, Spring Boot and Quillo: the measurements

Every result in the video comes from the runs below, copied from the run. `../shots.mjs` runs them and keeps the results
in `../assets/runs.json`. Measured on one machine.

- **When:** Thu Nov 19 2026 00:28:53 GMT+0800 (Singapore Standard Time) (as shots.mjs started)
- **Machine:** Apple M5, 16 GB, arm64; macOS 26.7.1 (25G241)
- **Spring Boot:** 4.1.2 (Spring Initializr's default that day), **Spring Security:** 7.1.2; **Java:** openjdk version "17.0.19" 2026-04-21;
  51 libraries in the jar (`jar tf`, BOOT-INF/lib)
- **oidc-provider:** 9.15.0; **Node:** v24.11.0
- **Quillo:** `quillo 0.8.6 (238dac2, 2026-11-16)` (the app folder's own, from its get-quillo.sh)
- **Browser:** Chromium (Playwright's), headless

## The provider and the sites

- **The provider** (`idp/provider.mjs`, video 137's, with this video's two clients): `npm install oidc-provider`, on
  http://localhost:4000, its development-only login page (any name and password); the club's sites skip the consent page.
  Clients: `trail-spring` (client_secret_basic, redirect http://trail.localhost:8091/login/oauth2/code/club) and
  `trail-quillo` (client_secret_post, redirect http://trail.localhost:8080/callback).
- **Spring Boot** (`spring/`): from Spring Initializr, `curl https://start.spring.io/starter.zip -d type=maven-project -d
  language=java -d javaVersion=17 -d groupId=com.example -d artifactId=trailclub -d name=trailclub -d
  packageName=com.example.trailclub -d dependencies=web,oauth2-client` (spring-boot-starter-security-oauth2-client and
  spring-boot-starter-webmvc). Added: `application.properties` (6 properties: the name, the port 8091, and the
  `club` registration: client id, secret from `CLIENT_SECRET`, scopes `openid,profile`, `issuer-uri`), `SecurityConfig.java`
  (one filter chain: `/` open, anything else signed in, `oauth2Login()` as it comes) and `HomeController.java` (the page,
  with `@AuthenticationPrincipal OidcUser`): 45 non-blank lines of Java. Built with `./mvnw package`; run with
  `CLIENT_SECRET=trail-spring-secret java -jar target/trailclub-0.0.1-SNAPSHOT.jar`.
- **Quillo** (`../app/main.qwe`, 39 non-blank lines): video 137's login by hand (discovery with `http.get`, a fresh
  `crypto.token()` state kept in the session, `?next=` only on this site with `local_path`, the state compared with
  `crypto.equal`, the code traded with `http.post`, the user from the userinfo endpoint), and a `?` after reading the
  provider's settings. `../steps/v1` is video 137's, without it. `quillo check`: v1 `main.qwe: ok (3 routes, 1 function, 0 components)`, app `main.qwe: ok (3 routes, 1 function, 0 components)`.
  Run with `CLIENT_SECRET=trail-quillo-secret quillo run main.qwe --port 8080`.

## One login each (login.sh)

`./login.sh` (login.mjs) logs in through each site in a fresh Chromium browser: the site's page, Log in, the provider's
login page (login "ana", any password), and back, and lists every page request (of each address's parameters, those that
keep a login safe: state, nonce, the PKCE challenge, the code):

```
spring: 7 page requests, 906 ms
  GET  trail.localhost:8091/oauth2/authorization/club 302 → localhost:4000/auth
  GET  localhost:4000/auth              303 → localhost:4000/interaction/nmxSLP…  with state, nonce, code_challenge
  GET  localhost:4000/interaction/nmxSLP… 200
  POST localhost:4000/interaction/nmxSLP… 303 → localhost:4000/auth/nmxSLP…
  GET  localhost:4000/auth/nmxSLP…      303 → trail.localhost:8091/login/oauth2/code/club
  GET  trail.localhost:8091/login/oauth2/code/club 302 → trail.localhost:8091/  with code, state
  GET  trail.localhost:8091/            200
quillo: 7 page requests, 711 ms
  GET  trail.localhost:8080/login       303 → localhost:4000/auth
  GET  localhost:4000/auth              303 → localhost:4000/interaction/pZ2b8U…  with state
  GET  localhost:4000/interaction/pZ2b8U… 200
  POST localhost:4000/interaction/pZ2b8U… 303 → localhost:4000/auth/pZ2b8U…
  GET  localhost:4000/auth/pZ2b8U…      303 → trail.localhost:8080/callback
  GET  trail.localhost:8080/callback    303 → trail.localhost:8080/  with code, state
  GET  trail.localhost:8080/            200
```

## Three holes (holes.sh)

`./holes.sh` (holes.mjs, video 137's, with each site's login and callback paths) tries, on each site: a login CSRF (Ana's
browser opens the callback address of Mallory's own login), an open redirect (Ana logs in from the login address with
`?next=http://evil.localhost:7777/`), and a planted session cookie (Mallory's, put in Ana's browser before she logs in):

```
spring:
  login CSRF      Ana opens Mallory's callback: "Please sign in"; Ana's home page: "Trail Club"
  open redirect   /oauth2/authorization/club?next=evil.localhost:7777 ends on trail.localhost:8091/
  planted cookie  Mallory's JSESSIONID, after Ana logs in, shows Mallory: "Trail Club"
quillo:
  login CSRF      Ana opens Mallory's callback: "This login wasn't started here"; Ana's home page: "Trail Club"
  open redirect   /login?next=evil.localhost:7777 ends on trail.localhost:8080/
  planted cookie  Mallory's __Host-quillo_session, after Ana logs in, shows Mallory: "Trail Club"
```

Spring's page for the login CSRF is its generated sign-in page, "Login with OAuth 2.0", saying "Invalid credentials".
Spring's login address takes no `?next=`: after the login it goes back to the page that asked for one, or to `/`.

## The provider down, at start

With the provider stopped, in a copy shown as `~/club`:

```
~/club/spring $ CLIENT_SECRET=trail-spring-secret java -jar target/trailclub-0.0.1-SNAPSHOT.jar &> spring.log; echo "exit $?"
exit 1
~/club/spring $ wc -l < spring.log
     228
~/club/spring $ grep -o 'Unable to resolve Configuration.*' spring.log | head -1
Unable to resolve Configuration with the provided Issuer of "http://localhost:4000"
~/club/spring $ grep -o 'Connection refused' spring.log | head -1
Connection refused
~/club/quillo $ quillo run main.qwe
quillo: main.qwe:5: error has no field `json`
~/club/quillo $ quillo run main.qwe
quillo: main.qwe: main.qwe:6: http: http://localhost:4000/.well-known/openid-configuration: Connection Failed: Connect error: Connection refused (os error 61)
```
