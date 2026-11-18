// The four photos of the bakery's journal (1600×1200 JPEGs, about 500 KB each, like a phone photo made smaller):
// each drawn as an SVG, shot with Playwright's Chromium, and saved as a JPEG with a little noise by ffmpeg.
//   node make.mjs <dir>
import { chromium } from 'playwright';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const out = process.argv[2];
const grain = `<filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4"/>
  <feColorMatrix values="0 0 0 0 0.5  0 0 0 0 0.35  0 0 0 0 0.2  0 0 0 0.35 0"/><feComposite in2="SourceGraphic" operator="in"/>
  <feBlend in="SourceGraphic" mode="multiply"/></filter>
  <filter id="shadow" x="-20%" y="-20%" width="140%" height="160%"><feGaussianBlur stdDeviation="28"/></filter>
  <filter id="soft"><feGaussianBlur stdDeviation="2"/></filter>`;
const table = (a, b) => `<defs><linearGradient id="wood" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>
  <pattern id="planks" width="1600" height="150" patternUnits="userSpaceOnUse">
  <rect width="1600" height="150" fill="url(#wood)"/><rect y="146" width="1600" height="4" fill="#000" opacity=".25"/></pattern>${grain}</defs>
  <rect width="1600" height="1200" fill="url(#wood)"/><rect width="1600" height="1200" fill="url(#planks)" opacity=".5"/>`;
const photos = {
  sourdough: `${table('#8a6a4f', '#4a3424')}
  <ellipse cx="800" cy="700" rx="560" ry="360" fill="#000" opacity=".45" filter="url(#shadow)"/>
  <ellipse cx="800" cy="640" rx="600" ry="380" fill="#c9a36b"/><ellipse cx="800" cy="630" rx="560" ry="350" fill="#b88c55"/>
  <defs><radialGradient id="crust" cx=".45" cy=".35" r=".7"><stop offset="0" stop-color="#e2a65a"/>
  <stop offset=".6" stop-color="#a8622a"/><stop offset="1" stop-color="#5e3112"/></radialGradient></defs>
  <ellipse cx="800" cy="600" rx="430" ry="290" fill="url(#crust)" filter="url(#grain)"/>
  <g stroke="#f3dcaa" stroke-width="26" stroke-linecap="round" fill="none" opacity=".85" filter="url(#soft)">
  <path d="M560 470 Q800 420 1040 470"/><path d="M520 600 Q800 550 1080 600"/><path d="M560 730 Q800 690 1040 730"/></g>`,
  croissants: `${table('#5c6b78', '#2c343c')}
  <circle cx="800" cy="640" r="520" fill="#000" opacity=".4" filter="url(#shadow)"/>
  <circle cx="800" cy="600" r="520" fill="#f4f1ea"/><circle cx="800" cy="600" r="470" fill="none" stroke="#ddd6c8" stroke-width="10"/>
  <defs><linearGradient id="gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6c66a"/>
  <stop offset=".55" stop-color="#d4882e"/><stop offset="1" stop-color="#8f4a14"/></linearGradient>
  <g id="cr" filter="url(#grain)"><path d="M-260 60 Q-200 -170 0 -190 Q200 -170 260 60 Q120 0 0 10 Q-120 0 -260 60Z" fill="url(#gold)"/>
  <g stroke="#7a3d10" stroke-width="10" opacity=".55" fill="none"><path d="M-120 -150 Q-90 -40 -110 10"/>
  <path d="M0 -185 Q20 -80 0 8"/><path d="M120 -150 Q90 -40 110 10"/></g></g></defs>
  <use href="#cr" transform="translate(800 470) rotate(-8)"/><use href="#cr" transform="translate(640 760) rotate(12) scale(.9)"/>
  <use href="#cr" transform="translate(990 790) rotate(-18) scale(.85)"/>`,
  rye: `${table('#a08060', '#5a4430')}
  <rect x="290" y="330" width="1020" height="620" rx="60" fill="#000" opacity=".45" filter="url(#shadow)"/>
  <rect x="250" y="280" width="1100" height="640" rx="50" fill="#d8b98c"/><rect x="250" y="280" width="1100" height="640" rx="50" fill="none" stroke="#b8956a" stroke-width="14"/>
  <defs><linearGradient id="ryecrust" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6b4630"/>
  <stop offset="1" stop-color="#2e1a10"/></linearGradient><radialGradient id="crumb" cx=".5" cy=".5" r=".6">
  <stop offset="0" stop-color="#9c7656"/><stop offset="1" stop-color="#6e4c34"/></radialGradient></defs>
  <rect x="360" y="380" width="560" height="420" rx="140" fill="url(#ryecrust)" filter="url(#grain)"/>
  <g filter="url(#grain)"><rect x="960" y="400" width="120" height="380" rx="40" fill="#3a2314"/><rect x="972" y="412" width="96" height="356" rx="32" fill="url(#crumb)"/>
  <rect x="1120" y="420" width="120" height="360" rx="40" fill="#3a2314"/><rect x="1132" y="432" width="96" height="336" rx="32" fill="url(#crumb)"/></g>
  <g fill="#f0e2c4" opacity=".7">${Array.from({ length: 40 }, (_, i) => `<circle cx="${400 + ((i * 137) % 480)}" cy="${420 + ((i * 89) % 340)}" r="5"/>`).join('')}</g>`,
  tart: `${table('#e8e0d4', '#b8ac9c')}
  <circle cx="800" cy="650" r="500" fill="#000" opacity=".3" filter="url(#shadow)"/>
  <circle cx="800" cy="600" r="500" fill="#ffffff"/>
  <defs><radialGradient id="pastry" cx=".5" cy=".4" r=".6"><stop offset="0" stop-color="#f2c98a"/><stop offset="1" stop-color="#b9772e"/></radialGradient>
  <radialGradient id="berry" cx=".35" cy=".3" r=".7"><stop offset="0" stop-color="#ff6b86"/><stop offset=".6" stop-color="#c21d45"/><stop offset="1" stop-color="#6d0a24"/></radialGradient>
  <radialGradient id="blue" cx=".35" cy=".3" r=".7"><stop offset="0" stop-color="#7f8fd8"/><stop offset=".6" stop-color="#2d3a8c"/><stop offset="1" stop-color="#151a45"/></radialGradient></defs>
  <circle cx="800" cy="600" r="400" fill="url(#pastry)" filter="url(#grain)"/><circle cx="800" cy="600" r="340" fill="#f5e6c8"/>
  ${Array.from({ length: 34 }, (_, i) => { const a = i * 2.4, r = 40 + (i * 9) % 280; return `<circle cx="${800 + Math.cos(a) * r}" cy="${600 + Math.sin(a) * r}" r="${i % 3 ? 44 : 34}" fill="url(#${i % 3 ? 'berry' : 'blue'})"/>`; }).join('')}
  <g fill="#4f8a3a"><path d="M790 560 q40 -60 90 -40 q-30 50 -90 40Z"/><path d="M780 570 q-50 -50 -100 -20 q40 40 100 20Z"/></g>`,
};
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 1200 } });
for (const [name, body] of Object.entries(photos)) {
  await page.setContent(`<body style="margin:0"><svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1200">${body}</svg></body>`);
  const png = path.join(out, `${name}.png`);
  await page.screenshot({ path: png });
  const r = spawnSync('ffmpeg', ['-v', 'error', '-y', '-i', png, '-vf', 'format=yuv420p,noise=alls=7:allf=t', '-q:v', '3', path.join(out, `${name}.jpg`)]);
  if (r.status) throw new Error(r.stderr.toString());
  fs.rmSync(png);
  console.log(name, fs.statSync(path.join(out, `${name}.jpg`)).size);
}
await browser.close();
