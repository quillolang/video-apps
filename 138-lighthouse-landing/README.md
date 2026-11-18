# Lighthouse on Next.js and Quillo: One Landing Page, the Same Scores, and What's Underneath

Hearth Bakery's landing page, in Quillo (main.qwe, on 8080): a hero photo made smaller as the server starts (image.convert, two JPEGs, picked by the browser with srcset), the page with its title, description and icon, and no JavaScript. compare/next is the same page in Next.js 16.4.6 (create-next-app), with next/image for the hero. compare/lh runs Lighthouse 13.6.0 on each, three times, with its default phone settings; compare/sizes compares the hero at 828 pixels from Quillo's image.convert and from sharp, what next/image uses. compare/MEASURE.md has every command and what it printed.

Written for Quillo 0.8.6 (get it at https://quillolang.org). Run it with:

```sh
./run.sh                                    # Quillo's page, on 8080
(cd compare/next && npm install && npm run build && npm start)   # Next's, on 3000
(cd compare/lh && npm install && node run.mjs next=http://localhost:3000/ quillo=http://localhost:8080/)
# Windows (PowerShell), with Quillo from quillolang.org: quillo run main.qwe
```

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
