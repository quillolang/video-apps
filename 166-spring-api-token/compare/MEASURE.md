# An API that checks the token, Spring Boot and Quillo: the measurements

Every result in the video comes from the runs below, copied from the run. `../shots.mjs` runs the calls and keeps the
results in `../assets/runs.json`; `token.mjs` wrote `../assets/token.txt`. Measured on one machine.

- **When:** Thu Nov 19 2026 01:10:56 GMT+0800 (as shots.mjs started); token.mjs later the same day
- **Machine:** Apple M5, arm64; macOS 26.7.1
- **Spring:** Spring Boot 4.1.2 (spring-boot-starter-parent), Spring Security 7.1.2 (spring-security-oauth2-jose),
  nimbus-jose-jwt 10.9.1; `openjdk version "17.0.19" 2026-04-21`; 44 libraries in the jar (`jar tf`, BOOT-INF/lib)
- **oidc-provider:** 9.15.0
- **Quillo:** `quillo 0.8.6 (238dac2, 2026-11-16)` (the app folder's own, from its get-quillo.sh)

## The provider and the APIs

- **The provider** (`idp/provider.mjs`, video 136's, comments changed for Spring): oidc-provider on
  http://localhost:4000. The club's site (`club-site`) gets tokens with client credentials, naming the API as the
  resource. For http://localhost:5100 (Spring) a token is a JWT; for http://localhost:5101 (Quillo) it's opaque; 5102
  and 5103 are the club's photos API, of each kind, for the "another API" call. Tokens live 8 seconds (`TTL`), so the
  calls can watch one expire. `trails-api-quillo` is the Quillo API's own client, for introspection.
- **Spring** (`spring/`, start.spring.io's Maven project, with spring-boot-starter-web and
  spring-boot-starter-oauth2-resource-server): `application.properties` (4 settings: the name, the port, the issuer and
  the audience), `TrailsController.java` (GET /api/trails, the trails.json in its resources; 19 non-blank lines), and
  `JwtConfig.java` (30 non-blank lines). Run with `java -jar target/trailsapi-0.0.1-SNAPSHOT.jar` (5100).
  - **The first try** (`variants/naive/README.md`): the project without JwtConfig.java, Boot's own decoder from
    application.properties alone. shots.mjs builds it in a copy of the project with that file taken out.
- **Quillo** (`../app/main.qwe`, 18 non-blank lines, video 136's): opaque tokens, and on each call the provider's
  introspection endpoint asked about the token with the API's own client id and secret; a 401 unless it's active and
  for this API. `quillo check`: `main.qwe: ok (1 route, 0 functions, 0 components)`. Run with
  `API_SECRET=trails-api-quillo-secret quillo run main.qwe --port 5101`.

## Seven calls (calls.sh, calls.mjs)

None, a good token, one for the photos API, a forged one (the good JWT with its payload changed, the signature kept;
for Quillo, random text), a fresh token revoked at the provider first, an expired one (after its 8 seconds and one
more), and that one a minute later. The "one call" row calls.mjs prints after the table (a median time) isn't in the
video: the machine was busy with other work.

```
$ ./calls.sh spring=http://localhost:5100          # the first try
         spring (a signed JWT)
none     401
good     401 invalid_token (An error occurred while attempting to decode the Jwt: the given typ value needs to be one of [JWT])
other    401 invalid_token (An error occurred while attempting to decode the Jwt: the given typ value needs to be one of [JWT])
forged   401 invalid_token (An error occurred while attempting to decode the Jwt: Signed JWT rejected: Invalid signature)
revoked  401 invalid_token (An error occurred while attempting to decode the Jwt: the given typ value needs to be one of [JWT])
expired  401 invalid_token (An error occurred while attempting to decode the Jwt: the given typ value needs to be one of [JWT])
a minute 401 invalid_token (An error occurred while attempting to decode the Jwt: the given typ value needs to be one of [JWT])
revoking spring's token: the provider answered 400 {"error":"unsupported_token_type","error_description":"Structu

$ ./calls.sh spring=http://localhost:5100          # with JwtConfig.java
         spring (a signed JWT)
none     401
good     200 6 trails
other    401 invalid_token (An error occurred while attempting to decode the Jwt: The aud claim is not valid)
forged   401 invalid_token (An error occurred while attempting to decode the Jwt: Signed JWT rejected: Invalid signature)
revoked  200 6 trails
expired  200 6 trails
a minute 401 invalid_token (An error occurred while attempting to decode the Jwt: Jwt expired at 2026-11-18T17:12:19Z)
revoking spring's token: the provider answered 400 {"error":"unsupported_token_type","error_description":"Structu

$ ./calls.sh quillo=http://localhost:5101
         quillo (opaque)
none     401 a token, please
good     200 6 trails
other    401 not a valid token
forged   401 not a valid token
revoked  401 not a valid token
expired  401 not a valid token
a minute 401 not a valid token
revoking quillo's token: the provider answered 200
```

Spring Security's `JwtTimestampValidator` allows 60 seconds of clock skew by default, so the expired JWT was still
taken right after it expired, and refused a minute later.

## The token, and revoking it (token.mjs)

```
$ node token.mjs
## a token for http://localhost:5100: Bearer, expires_in 8
header: {"alg":"RS256","typ":"at+jwt","kid":"keystore-CHANGE-ME"}
claims: jti, sub, iat, exp, scope, client_id, iss, aud (aud "http://localhost:5100")
revoke it: 400 {"error":"unsupported_token_type","error_description":"Structured JWT Tokens cannot be revoked via the revocation_endpoint"}
## a token for http://localhost:5101: Bearer, expires_in 8
opaque: 43 characters, no dots
revoke it: 200
```

`typ: at+jwt` is the type RFC 9068 gives JWT access tokens. The decoder Boot makes from the issuer-uri checks the type
and takes only `JWT`; Boot has no property to change it, so `JwtConfig.java` builds the decoder itself
(`NimbusJwtDecoder.withIssuerLocation(issuer).validateType(false)`) and lists the checks: `JwtTimestampValidator`,
`JwtIssuerValidator(issuer)`, `JwtTypeValidator("at+jwt")`, and a `JwtClaimValidator` for the audience.

## Lines

Non-blank lines: application.properties 4 (without its comment), TrailsController.java 19, JwtConfig.java 30 (53 for
Spring, in three files); main.qwe 18.
