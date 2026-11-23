// Writes fortunes.db (the table the /db answers read) beside main.qwe, from the list in main.qwe itself.
//   node compare/make-db.mjs        (bench.mjs and run-curl.sh run it first)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';
export const here = path.dirname(fileURLToPath(import.meta.url));
// The Quillo app: ../app in the video's folder, the folder above this one in the video-apps repository.
export const appDir = fs.existsSync(path.resolve(here, '../app/main.qwe')) ? path.resolve(here, '../app') : path.resolve(here, '..');
const src = fs.readFileSync(path.join(appDir, 'main.qwe'), 'utf8');
const rows = [...src.matchAll(/\{ id: (\d+), message: "((?:[^"\\]|\\.)*)" \}/g)].filter((m) => m[1] !== '0').map((m) => [Number(m[1]), JSON.parse(`"${m[2]}"`)]);
if (rows.length !== 12) throw new Error(`main.qwe should list 12 fortunes, found ${rows.length}`);
const file = path.join(appDir, 'fortunes.db');
for (const f of [file, `${file}-wal`, `${file}-shm`]) fs.rmSync(f, { force: true });
const db = new DatabaseSync(file);
db.exec('create table fortune (id integer primary key, message text not null)');
const insert = db.prepare('insert into fortune (id, message) values (?, ?)');
for (const r of rows) insert.run(...r);
db.close();
