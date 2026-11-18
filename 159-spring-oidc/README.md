# Log In with OpenID Connect: Spring Boot vs Quillo, by Hand

Trail Club logs in with the club's OpenID Connect provider (compare/idp, oidc-provider 9.15.0, its development login page), in Quillo by hand (main.qwe, on trail.localhost:8080): the code flow with http.get and http.post, a fresh state for each login, and ?next= only on this site. compare/spring is the same site in Spring Boot 4.1.2 with spring-boot-starter-security-oauth2-client (Spring Security 7.1.2): application.properties, SecurityConfig.java and HomeController.java, on trail.localhost:8091. compare/login.sh logs in through both and lists every page request; compare/holes.sh tries a login CSRF, an open redirect and a planted session cookie on both; compare/MEASURE.md has every command and what it printed.

Written for Quillo 0.8.6 (get it at https://quillolang.org). Run it with:

```sh
(cd compare/idp && npm install && node provider.mjs &)   # the provider, on 4000
CLIENT_SECRET=trail-quillo-secret ./run.sh   # Quillo's Trail Club: http://trail.localhost:8080
(cd compare/spring && CLIENT_SECRET=trail-spring-secret ./mvnw spring-boot:run)   # Spring's: http://trail.localhost:8091
(cd compare && ./login.sh && ./holes.sh)
# Windows (PowerShell), with Quillo from quillolang.org: $env:CLIENT_SECRET = 'trail-quillo-secret'; quillo run main.qwe
```

## The versions in the video

The video starts from the login of video 137, kept here as it was. It runs on its own too (`cd steps/v1 && CLIENT_SECRET=trail-quillo-secret ./run.sh`, with the provider running):

- [`steps/v1`](steps/v1): video 137's login: with the provider down at start, it says only "error has no field `json`"
- this folder: the same, with a ? on reading the provider's settings: with the provider down, it says why

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
