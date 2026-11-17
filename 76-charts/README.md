# Charts With No Library: SVG Bars and Sparklines From a Database | Quillo

Allotment: a year of rain as a bar chart, and four tomato plants as sparklines, drawn as SVG by views from a SQLite notebook, with no chart library. The video builds it in three steps: the bars (steps/v1), the sparklines (steps/v2), and a component that switches the year with a server fn (the app).

Written for Quillo 0.8.6. `run.sh` downloads that Quillo the first time:

```sh
./run.sh --watch
```

Then open http://127.0.0.1:8080.

## The versions in the video

The video builds this app up step by step. Each step is a folder that runs on its own (`cd steps/v1 && ./run.sh --watch`):

- [`steps/v1`](steps/v1): this year's rain as bars
- [`steps/v2`](steps/v2): and the tomatoes as sparklines
- this folder: a year switch in a component
