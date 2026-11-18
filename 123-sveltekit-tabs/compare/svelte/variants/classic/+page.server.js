import { db } from '#lib/server/db.js';

export function load() {
	return { items: db.prepare('select id, name, bought from items order by id').all() };
}

export const actions = {
	add: async ({ request }) => {
		const name = String((await request.formData()).get('name') ?? '').trim();
		if (name) db.prepare('insert into items (name) values (?)').run(name);
	},
	toggle: async ({ request }) => {
		const id = Number((await request.formData()).get('id'));
		db.prepare('update items set bought = 1 - bought where id = ?').run(id);
	}
};
