# A Bad JSON Body in Spring Boot vs Quillo: @Valid, Bean Validation, and the 400 That Doesn't Say Why

The bake sale's sign-ups API in Quillo (main.qwe, on 8080, the same as videos 131 and 150): a record type, `Signup(request.json)`, and the rules in `problems`. compare/spring is the same API in Spring Boot 4.1.2 (Initializr: Spring Web and Validation, Java 17.0.19): SignupController.java with Bean Validation and @Valid; variants/naive is the first try (a plain record), and variants/detailed adds three application.properties lines (the reasons in the error, unknown fields refused). compare/build-variants.sh builds all three; compare/send.sh sends seven bodies; compare/why.sh asks the detailed one why; compare/MEASURE.md has every command and what it printed.

Written for Quillo 0.8.6 (get it at https://quillolang.org). Run it with:

```sh
./run.sh                                     # Quillo's API, on 8080
(cd compare/spring && ./mvnw spring-boot:run)   # Spring's, with @Valid, on 8080 too: add -Dspring-boot.run.arguments=--server.port=8091
(cd compare && ./send.sh http://localhost:8091)
# Windows (PowerShell), with Quillo from quillolang.org: quillo run main.qwe; cd compare\spring; .\mvnw.cmd spring-boot:run
```

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
