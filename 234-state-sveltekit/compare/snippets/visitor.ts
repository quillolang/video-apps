// Remote functions: each runs on the server; the page calls them like plain functions.
import { form, getRequestEvent, query } from '$app/server';
import { add, addVisitor, counter, read, visitorCount } from '#lib/server/state';

// This visitor: the id in their cookie picks their row. A new visitor gets a random id.
export const getVisitor = query(async () => visitorCount(getRequestEvent().cookies.get('visitor')));
export const addVisitorOne = form(async () => {
	const { cookies } = getRequestEvent();
	let id = cookies.get('visitor');
	if (!id) {
		id = crypto.randomUUID();
		cookies.set('visitor', id, { path: '/', maxAge: 60 * 60 * 24 * 365 });
	}
	addVisitor(id);
	void getVisitor().refresh();
});
