// The hero at 828 pixels wide, three ways, and each file's size: Quillo's image.convert (sizes.qwe, run with the app's
// own Quillo) as WebP and as JPEG, and sharp (what next/image uses) as WebP and as JPEG, all at quality 75.
//   node sizes.mjs
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const sharp = createRequire(path.join(here, '../next/package.json'))('sharp');
// The Quillo app: ../../app in the video's own folder, ../.. in github.com/quillolang/video-apps.
const app = fs.existsSync(path.join(here, '../../app/main.qwe')) ? path.join(here, '../../app') : path.join(here, '../..');
const src = path.join(app, 'public/hero.jpg');
fs.copyFileSync(src, path.join(here, 'hero.jpg'));   // Quillo reads files in its own folder
const q = spawn(path.join(app, '.quillo/bin/quillo'), ['run', 'sizes.qwe', '--port', '8098'], { cwd: here, stdio: 'ignore' });
for (let i = 0; i < 80; i++) { try { await (await fetch('http://127.0.0.1:8098/')).json(); break; } catch { await new Promise((r) => setTimeout(r, 250)); } }
q.kill();
const sizes = {
  'quillo webp': fs.statSync(path.join(here, 'hero-828.webp')).size, 'quillo jpeg': fs.statSync(path.join(here, 'hero-828.jpg')).size,
  'sharp webp': (await sharp(src).resize(828).webp({ quality: 75 }).toBuffer()).length,
  'sharp jpeg': (await sharp(src).resize(828).jpeg({ quality: 75 }).toBuffer()).length,
};
for (const f of ['hero-828.webp', 'hero-828.jpg', 'hero.jpg']) fs.rmSync(path.join(here, f));
console.log(JSON.stringify(sizes));
