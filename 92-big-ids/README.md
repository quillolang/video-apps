# JavaScript Showed My Customer Someone Else's Order (a 64-Bit ID, Rounded)

Luigi's order tracking, with 64-bit order ids, as big systems number things: Bob's order is 9007199254740992 and Ada's is 9007199254740993. The JSON API (Quillo) sends Ada's id exactly. The tracking page in plain JavaScript (public/track.html, at /track) parses it with JSON.parse, which rounds it to Bob's number, so "Show it" fetches Bob's order for Ada. The same page as a Quillo component (/) keeps the id exact through the browser and back, and shows Ada's.

Written for Quillo 0.8.6 (get it at https://quillolang.org). Run it with:

```sh
./run.sh     # then http://localhost:8080/track (plain JavaScript) and http://localhost:8080/ (Quillo)
```
