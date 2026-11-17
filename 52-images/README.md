# Build an Avatar Maker: Crop and Shrink Uploads in Quillo (image.info, image.convert)

Avatars: upload any picture, and image.info and image.convert make a square avatar from its middle, at most 256 pixels. Not a picture? A 415. The pictures in the video were drawn with ffmpeg.

Written for Quillo 0.8.6. `run.sh` downloads that Quillo the first time:

```sh
./run.sh --watch
```

Then open http://127.0.0.1:8080.
