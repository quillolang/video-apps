# CSS the Quillo Way: Scoped Styles, Typos Caught, and a Link That Tried to Close the Shop

Crumbs, a bakery: a menu whose MenuCard and Badge views both style .title, each scoped to its own (the badge sits inside the card's title), and a gift card in the colour a link asks for. The video's first version puts that colour into a plain template string inside <style>, so a link can close the rule and add its own ("Closed for good"); the app writes it with css`...`, which keeps it to one CSS value.

Written for Quillo 0.8.6. `run.sh` downloads that Quillo the first time:

```sh
./run.sh --watch
```

Then open http://127.0.0.1:8080.

## The versions in the video

The video builds this app up step by step. Each step is a folder that runs on its own (`cd steps/v1 && ./run.sh --watch`):

- [`steps/v1`](steps/v1): the gift card's colour in a plain template string: a link can add CSS rules
- this folder: css`...` for the gift card's colour
