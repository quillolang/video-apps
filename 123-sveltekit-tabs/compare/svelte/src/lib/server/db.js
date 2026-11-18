import { DatabaseSync } from 'node:sqlite';

export const db = new DatabaseSync('groceries.db');
db.exec(`create table if not exists items (
	id integer primary key, name text not null, bought integer not null default 0)`);
