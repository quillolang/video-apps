import { DatabaseSync } from 'node:sqlite';
import { EventEmitter } from 'node:events';

export const db = new DatabaseSync('groceries.db');
db.exec(`create table if not exists items (
	id integer primary key, name text not null, bought integer not null default 0)`);

// the live query waits for this; every write must emit it
export const changes = new EventEmitter();
