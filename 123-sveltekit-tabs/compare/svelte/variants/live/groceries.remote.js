import { once } from 'node:events';
import { query } from '$app/server';
import { db, changes } from '#lib/server/db.js';

export const getItems = query.live(async function* () {
	while (true) {
		yield db.prepare('select id, name, bought from items order by id').all();
		await once(changes, 'change');
	}
});
