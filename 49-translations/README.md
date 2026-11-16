# Hello, Hola, こんにちは: Translating a Quillo App (with Plurals)

The Little Card Shop, in English, Spanish and Japanese: translations("locales"), t() with plural forms in the page and in a component, the language a browser asks for, and a choice of language kept in a cookie. locales/ja.json leaves out the sale line on purpose: it falls back to English.

Written for Quillo 0.8.6. `run.sh` downloads that Quillo the first time:

```sh
./run.sh --watch
```

Then open http://127.0.0.1:8080.
