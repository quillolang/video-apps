# /trails/abc in Spring Boot vs Quillo: a 400, the Whitelabel Page, and Typed Routes

Trail Guide: a page for each of six trails at /trails/<its number>, in Quillo (main.qwe, on 8080): `route GET /trails/:id(int)` matches only a plain whole number, a missing trail answers 404 with a page of its own, and a last `route GET /*rest` is the 404 page for every other address. compare/spring is the same site in Spring Boot 4.1.2 from Spring Initializr (Spring Web and Thymeleaf, Java 17.0.19): `@GetMapping("/trails/{id}")` with a Long id. compare/build-variants.sh builds it as it is and two ways more (pages: templates/error/4xx.html; regex: `{id:[1-9][0-9]*}` in the mapping); compare/status.sh asks six addresses as a browser asks; compare/MEASURE.md has every command and what it printed.

Written for Quillo 0.8.6 (get it at https://quillolang.org). Run it with:

```sh
./run.sh                                     # Quillo's Trail Guide, on 8080
(cd compare/spring && ./mvnw spring-boot:run)   # Spring's, on 8090
(cd compare && ./status.sh http://localhost:8090 && ./status.sh http://localhost:8080)
# Windows (PowerShell), with Quillo from quillolang.org: quillo run main.qwe; cd compare\spring; .\mvnw.cmd spring-boot:run
```

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
