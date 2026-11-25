import { HydrationScript } from '@solidjs/web';

// The document shell (the index.html replacement), picked up by the src/Document.* convention.
export default function Document(props) {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Solid</title>
        <HydrationScript />
      </head>
      <body>{props.children}</body>
    </html>
  );
}
