# /trails/abc in Spring Boot and Quillo: the measurements

Every result in the video comes from the runs below, copied from the run. `../shots.mjs` runs them and keeps the results
in `../assets/runs.json`. Measured on one machine.

- **When:** Wed Nov 18 2026 22:26:17 GMT+0800 (Singapore Standard Time) (as shots.mjs started)
- **Machine:** Apple M5, 16 GB, arm64; macOS 26.7.1 (25G241)
- **Spring Boot:** 4.1.2 (Spring Initializr's default that day); **Java:** openjdk version "17.0.19" 2026-04-21;
  **Maven:** Apache Maven 3.9.16
- **Quillo:** `quillo 0.8.6 (238dac2, 2026-11-16)` (the app folder's own, from its get-quillo.sh)

## The sites

The Trail Guide of videos 128 and 143: six trails, a page for each at `/trails/<its number>`.

- **Spring Boot** (`spring/`): from Spring Initializr, `curl https://start.spring.io/starter.zip -d type=maven-project
  -d language=java -d javaVersion=17 -d groupId=com.example -d artifactId=trailguide -d name=trailguide -d
  packageName=com.example.trailguide -d dependencies=web,thymeleaf`. Added: `Trail.java` (a record) and
  `TrailController.java` (35 lines of Java with Trail.java): the trails read once with the JSON mapper Spring Boot
  gives (Jackson 3's `JsonMapper`), `@GetMapping("/")`, and `@GetMapping("/trails/{id}")` with `@PathVariable Long id`,
  a missing trail thrown as `ResponseStatusException(HttpStatus.NOT_FOUND, "No such trail")`; Thymeleaf templates
  `home.html` and `trail.html` (17 lines); `trails.json` in resources; `static/trails.css`; `server.port=8090`. The jar
  (`mvn -DskipTests package`) holds 39 libraries in `BOOT-INF/lib`. It started in 3.122 seconds ("Started TrailguideApplication in 3.122 seconds").
- **Quillo** (`../app/main.qwe`, 25 lines, the same as videos 128 and 143): `route GET /trails/:id(int)`, a 404 for a
  missing trail, and `route GET /*rest` for the rest. `quillo check` prints `main.qwe: ok (3 routes, 2 functions, 0
  components)`.

`build-variants.sh build` builds the Spring site three ways in `build/`, each run with `java -jar app.jar
--server.port=<port>`:

- **app**: `spring/` as it is, Spring Boot's own error pages (8090).
- **pages**: with `variants/pages/.../templates/error/4xx.html`, the site's own page for every 4xx error (8091).
- **regex**: that page too, and the mapping `@GetMapping("/trails/{id:[1-9][0-9]*}")` (8092).
  `diff {spring,build/regex}/src/main/java/com/example/trailguide/TrailController.java`:

```
32c32
< 	@GetMapping("/trails/{id}")
---
> 	@GetMapping("/trails/{id:[1-9][0-9]*}")
```

## Six addresses (status.sh)

`./status.sh <site>` asks six addresses with curl as a browser asks (`Accept: text/html`; for `*/*`, Spring Boot's error
answer is JSON) and prints each one's status and heading. Spring Boot as it is (8090):

```
200  /trails/2    Eagle Ridge
200  /trails/02   Eagle Ridge
200  /trails/+2   Eagle Ridge
400  /trails/abc  Whitelabel Error Page
404  /trails/999  Whitelabel Error Page
404  /nope        Whitelabel Error Page
```

With the error page (8091):

```
200  /trails/2    Eagle Ridge
200  /trails/02   Eagle Ridge
200  /trails/+2   Eagle Ridge
400  /trails/abc  400: Bad Request
404  /trails/999  404: Not Found
404  /nope        404: Not Found
```

With the error page and the pattern (8092):

```
200  /trails/2    Eagle Ridge
404  /trails/02   404: Not Found
404  /trails/+2   404: Not Found
404  /trails/abc  404: Not Found
404  /trails/999  404: Not Found
404  /nope        404: Not Found
```

Quillo (8080):

```
200  /trails/2    Eagle Ridge
404  /trails/02   404: No such page
404  /trails/+2   404: No such page
404  /trails/abc  404: No such page
404  /trails/999  404: No such trail
404  /nope        404: No such page
```

The Whitelabel page for `/trails/abc`, as text: "Whitelabel Error Page / This application has no explicit mapping for
/error, so you are seeing this as a fallback. / Wed Nov 18 22:26:45 SGT 2026 / There was an unexpected error
(type=Bad Request, status=400)."

`curl -s -w '\n%{http_code}\n' localhost:8090/trails/abc | tail -c 160`:

```
{"timestamp":"2026-11-18T14:26:45.363Z","status":400,"error":"Bad Request","path":"/trails/abc"}
400
```

## A POST to a trail

`curl -s -X POST -D - -o /dev/null localhost:<port>/trails/2 | grep -i -e '^HTTP' -e '^allow'`:

```
8090 (Spring Boot):  HTTP/1.1 405
                     Allow: GET
8080 (Quillo):       HTTP/1.1 405 Method Not Allowed
                     allow: GET, HEAD, OPTIONS
```
