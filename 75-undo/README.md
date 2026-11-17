# Undo for Free: a Pixel-Art Editor Whose History Is Just a List | Quillo

Pixels, a 16 by 16 pixel-art editor: pick a colour and paint by dragging. Since nothing changes in place, a picture is a value, and its history is just a list of them: undo takes the last one back, redo puts it forward again, and a slider travels to any version. The video builds it in three steps: painting (steps/v1), undo and redo (steps/v2), and the slider (the app).

Written for Quillo 0.8.6. `run.sh` downloads that Quillo the first time:

```sh
./run.sh --watch
```

Then open http://127.0.0.1:8080.

## The versions in the video

The video builds this app up step by step. Each step is a folder that runs on its own (`cd steps/v1 && ./run.sh --watch`):

- [`steps/v1`](steps/v1): painting, with no way back
- [`steps/v2`](steps/v2): undo and redo
- this folder: a slider through every version
