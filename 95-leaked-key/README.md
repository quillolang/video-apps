# Your API Key Is in the Page Source. Check Yours

Lisbon's weather, as a widget, and a weather API's key. weather/server.mjs is a stand-in for a paid weather API, on this machine, that answers only requests with the key (.env.example holds a made-up one: copy it to .env). The plain JavaScript widget (public/widget.html, at /widget) carries the key in its script, so anyone who reads the page can use it. In Quillo, a component that reads env() is refused by quillo check (steps/mistake, on purpose); the app's server fn reads the key itself, so the page and its scripts never hold it.

Written for Quillo 0.8.6 (get it at https://quillolang.org). Run it with:

```sh
cp .env.example .env      # the made-up key
node weather/server.mjs   # the stand-in weather API, on 9090
./run.sh                  # Quillo, on 8080: / is Quillo's widget, /widget the plain JavaScript one
curl -s localhost:8080/widget | grep WEATHER_KEY
```

## The versions in the video

The video also shows a version that quillo check refuses, on purpose (`cd steps/mistake && quillo check`):

- [`steps/mistake`](steps/mistake): the key read in the component and handed to the server fn: quillo check refuses it, on purpose
- this folder: the finished app
