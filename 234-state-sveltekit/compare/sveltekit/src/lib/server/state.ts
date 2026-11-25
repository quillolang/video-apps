// The state the server keeps: SQLite for what lasts (and for each visitor), and a variable until a restart.
import { DatabaseSync } from 'node:sqlite';

const db = new DatabaseSync(process.env.STATE_DB ?? 'state.db', { timeout: 5000 });
db.exec('create table if not exists counts (name text primary key, n int not null)');
db.exec("insert or ignore into counts (name, n) values ('saved', 0), ('synced', 0)");
db.exec('create table if not exists visitors (id text primary key, n int not null)');

export const read = (name: string): number =>
	Number(db.prepare('select n from counts where name = ?').get(name)!.n);
export const add = (name: string) => db.prepare('update counts set n = n + 1 where name = ?').run(name);

export const counter = { everyone: 0 }; // one value for this process, until it restarts

// A visitor is a random id in a cookie; their count is a row in the database.
export const visitorCount = (id?: string): number =>
	Number((id && db.prepare('select n from visitors where id = ?').get(id)?.n) ?? 0);
export const addVisitor = (id: string) =>
	db.prepare('insert into visitors (id, n) values (?, 1) on conflict (id) do update set n = n + 1').run(id);
