# A bad JSON body, Spring Boot and Quillo: the measurements

Every result in the video comes from the runs below, copied from the run. `../shots.mjs` runs them and keeps the results
in `../assets/runs.json`. Measured on one machine.

- **When:** Wed Nov 18 2026 23:03:23 GMT+0800 (Singapore Standard Time) (as shots.mjs started)
- **Machine:** Apple M5, 16 GB, arm64; macOS 26.7.1 (25G241)
- **Spring Boot:** 4.1.2 (Spring Initializr's default that day); **Java:** openjdk version "17.0.19" 2026-04-21; 39 libraries in the jar
- **Quillo:** `quillo 0.8.6 (238dac2, 2026-11-16)` (the app folder's own, from its get-quillo.sh)

## The APIs

The bake sale's sign-ups, as in videos 131 and 150: `POST /api/signups` takes a name, an email and a number of guests,
and `GET /api/signups` lists what was saved.

- **Spring Boot** (`spring/`): from Spring Initializr, `curl https://start.spring.io/starter.zip -d type=maven-project -d
  language=java -d javaVersion=17 -d groupId=com.example -d artifactId=signups -d name=signups -d
  packageName=com.example.signups -d dependencies=web,validation`, and a `SignupController` (28 non-blank lines) with a
  `record Signup` whose fields carry Bean Validation's annotations (`@NotBlank String name`, `@NotBlank @Email String
  email`, `@NotNull @Min(0) @Max(8) Integer guests`) and `add(@Valid @RequestBody Signup signup)`.
  - `variants/naive/`: the first try (22 lines): `record Signup(String name, String email, int guests)` and a plain
    `@RequestBody`.
  - `variants/detailed/`: `spring/` with this application.properties:

```
spring.application.name=signups
# Say why a request is refused (Spring Boot hides it by default), and refuse fields a record does not have.
spring.web.error.include-message=always
spring.web.error.include-binding-errors=always
spring.jackson.deserialization.fail-on-unknown-properties=true
```

- **Quillo** (`../app/main.qwe`, 17 lines, the same as videos 131 and 150): `type Signup = { name: str, email: str,
  guests: int }`, `Signup(request.json)`, and `problems` for the rules. `quillo check` prints `main.qwe: ok (2 routes, 1 function, 0 components)`.

`build-variants.sh build` builds the three Spring versions in `build/` (`mvn -q -DskipTests package`); shots.mjs runs them
with `java -jar app.jar --server.port=<port>`: naive on 8090, valid on 8091, detailed on 8092; Quillo on 8080.

## Seven bodies (send.sh)

`./send.sh <api>` sends the same seven bodies and prints each answer's status and the start of its body (96
characters), then what was saved. Spring, the first try (8090):

```
good           201 {"name":"Ana","email":"ana@example.com","guests":2}
no email       201 {"name":"Ben","email":null,"guests":1}
no guests      400 {"timestamp":"2026-11-18T15:03:30.513Z","status":400,"error":"Bad Request","path":"/api/signups"
guests: two    400 {"timestamp":"2026-11-18T15:03:30.535Z","status":400,"error":"Bad Request","path":"/api/signups"
paid: true     201 {"name":"Di","email":"di@example.com","guests":0}
bad values     201 {"name":"","email":"nope","guests":-3}
not JSON       400 {"timestamp":"2026-11-18T15:03:30.583Z","status":400,"error":"Bad Request","path":"/api/signups"
saved          [{"name":"Ana","email":"ana@example.com","guests":2},{"name":"Ben","email":null,"guests":1},{"name":
```

Spring with @Valid (8091):

```
good           201 {"name":"Ana","email":"ana@example.com","guests":2}
no email       400 {"timestamp":"2026-11-18T15:03:30.818Z","status":400,"error":"Bad Request","path":"/api/signups"
no guests      400 {"timestamp":"2026-11-18T15:03:30.845Z","status":400,"error":"Bad Request","path":"/api/signups"
guests: two    400 {"timestamp":"2026-11-18T15:03:30.863Z","status":400,"error":"Bad Request","path":"/api/signups"
paid: true     201 {"name":"Di","email":"di@example.com","guests":0}
bad values     400 {"timestamp":"2026-11-18T15:03:30.906Z","status":400,"error":"Bad Request","path":"/api/signups"
not JSON       400 {"timestamp":"2026-11-18T15:03:30.926Z","status":400,"error":"Bad Request","path":"/api/signups"
saved          [{"name":"Ana","email":"ana@example.com","guests":2},{"name":"Di","email":"di@example.com","guests":
```

Spring with @Valid and the three properties (8092):

```
good           201 {"name":"Ana","email":"ana@example.com","guests":2}
no email       400 {"timestamp":"2026-11-18T15:03:31.015Z","status":400,"error":"Bad Request","message":"Validation
no guests      400 {"timestamp":"2026-11-18T15:03:31.035Z","status":400,"error":"Bad Request","message":"Validation
guests: two    400 {"timestamp":"2026-11-18T15:03:31.048Z","status":400,"error":"Bad Request","message":"JSON parse
paid: true     400 {"timestamp":"2026-11-18T15:03:31.061Z","status":400,"error":"Bad Request","message":"JSON parse
bad values     400 {"timestamp":"2026-11-18T15:03:31.075Z","status":400,"error":"Bad Request","message":"Validation
not JSON       400 {"timestamp":"2026-11-18T15:03:31.089Z","status":400,"error":"Bad Request","message":"JSON parse
saved          [{"name":"Ana","email":"ana@example.com","guests":2}]
```

Quillo (8080):

```
good           201 {"name":"Ana","email":"ana@example.com","guests":2}
no email       400 {"error":"Signup: `email` is missing"}
no guests      400 {"error":"Signup: `guests` is missing"}
guests: two    400 {"error":"Signup: `guests` must be int, got str \"two\""}
paid: true     201 {"name":"Di","email":"di@example.com","guests":0}
bad values     400 {"errors":["name: empty","email: not an email address","guests: from 0 to 8"]}
not JSON       400 {"error":"Signup: `name` is missing"}
saved          [{"name":"Ana","email":"ana@example.com","guests":2},{"name":"Di","email":"di@example.com","guests":
```

## Why (why.sh)

`./why.sh '<body>'` sends a body to the detailed API and prints the error's `message` and each field error's `field` and
`defaultMessage` (with jq).

```
$ ./why.sh '{"name":"Ben","guests":1}'
{"message":"Validation failed for object='signup'. Error count: 1","errors":[{"field":"email","defaultMessage":"must not be blank"}]}
$ ./why.sh '{"name":"Cy","email":"cy@example.com","guests":"two"}'
{"message":"JSON parse error: Cannot deserialize value of type `java.lang.Integer` from String \"two\": not a valid `java.lang.Integer` value","errors":[]}
```

Found while making it: with Spring Boot 4.1.2, the old `server.error.include-message` and
`server.error.include-binding-errors` properties had no effect here; `spring.web.error.*` did. With
`spring.mvc.problemdetails.enabled=true` the answer is `{"detail":"Invalid request content.",...}`, without the field.
