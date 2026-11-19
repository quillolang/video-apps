# An API That Checks the Token: Spring Boot Resource Server vs Quillo

The club's trails API in Quillo (main.qwe, on 5101, video 136's): the token is opaque, and on each call the provider (compare/idp, oidc-provider 9.15.0) is asked about it, with the API's own client id and secret. compare/spring is the same API in Spring Boot 4.1.2 (Spring Security 7.1.2) as a resource server on 5100: JWTs, checked against the provider's keys, with application.properties for the issuer and audience, and JwtConfig.java for the at+jwt token type Boot refuses as it comes. compare/calls.sh calls both seven ways; compare/token.mjs shows a token's header and what revoking it does; compare/MEASURE.md has every command and what it printed.

Written for Quillo 0.8.6 (get it at https://quillolang.org). Run it with:

```sh
(cd compare/idp && npm install && node provider.mjs &)   # the provider, on 4000
API_SECRET=trails-api-quillo-secret ./run.sh --port 5101   # Quillo's API
(cd compare/spring && ./mvnw spring-boot:run)   # Spring's API, on 5100
(cd compare && ./calls.sh spring=http://localhost:5100 quillo=http://localhost:5101)
# Windows (PowerShell), with Quillo from quillolang.org: $env:API_SECRET = 'trails-api-quillo-secret'; quillo run main.qwe --port 5101
```

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
