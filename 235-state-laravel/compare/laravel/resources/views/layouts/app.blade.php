<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>{{ $title ?? config('app.name') }}</title>
        <style>
            body { font: 18px system-ui; margin: 24px; background: #f6f3ee; }
            h1 { font-size: 26px; }
            button { display: block; box-sizing: border-box; width: 340px; margin: 8px 0; padding: 10px 14px; font: inherit;
                text-align: left; background: #fff; border: 2px solid #6b4eff; border-radius: 10px; color: #222; cursor: pointer; }
        </style>
    </head>
    <body>
        {{ $slot }}
    </body>
</html>
