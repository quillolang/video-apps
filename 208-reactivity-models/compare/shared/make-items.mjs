// Writes items.mjs's 50 items into each app: React, Vue, Svelte and Solid import items.js; Dioxus has items.rs;
// Quillo has items.qwe. Run it from compare/: node shared/make-items.mjs
import fs from 'node:fs';
import { ITEMS } from './items.mjs';
const js = `// The 50 items every Groceries app starts with (written by shared/make-items.mjs).\nexport const ITEMS = [\n${ITEMS.map(i => `  { id: ${i.id}, name: ${JSON.stringify(i.name)}, cents: ${i.cents}, qty: ${i.qty}, done: ${i.done} },`).join('\n')}\n];\n`;
for (const d of ['react/src', 'vue/src', 'svelte/src', 'solid/src']) fs.writeFileSync(`${d}/items.js`, js);
const rs = `// The 50 items every Groceries app starts with (written by shared/make-items.mjs).\nuse crate::Item;\n\npub fn items() -> Vec<Item> {\n    vec![\n${ITEMS.map(i => `        Item { id: ${i.id}, name: ${JSON.stringify(i.name)}.to_string(), cents: ${i.cents}, qty: ${i.qty}, done: ${i.done} },`).join('\n')}\n    ]\n}\n`;
fs.writeFileSync('dioxus/src/items.rs', rs);
const q = `// The 50 items every Groceries app starts with (written by shared/make-items.mjs).\nlet ITEMS = [\n${ITEMS.map(i => `    { id: ${i.id}, name: ${JSON.stringify(i.name)}, cents: ${i.cents}, qty: ${i.qty}, done: ${i.done} },`).join('\n')}\n]\n`;

fs.writeFileSync('../app/items.qwe', q);
for (const d of ['react/src', 'vue/src', 'svelte/src', 'solid/src']) fs.copyFileSync('shared/groceries.css', `${d}/groceries.css`);
fs.copyFileSync('shared/groceries.css', 'dioxus/assets/groceries.css');
fs.mkdirSync('../app/public', { recursive: true });
fs.copyFileSync('shared/groceries.css', '../app/public/groceries.css');
console.log('items written for six apps');
