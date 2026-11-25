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

// Everyone, until a restart: a variable on the server.
export const getEveryone = query(async () => counter.everyone);
export const addEveryoneOne = form(async () => {
	counter.everyone++;
	void getEveryone().refresh();
});

// Everyone, for good: SQLite.
export const getSaved = query(async () => read('saved'));
export const addSavedOne = form(async () => {
	add('saved');
	void getSaved().refresh();
});

// Kept in sync: a live query. While a page shows it, the server reads the database every second
// and sends the count down an open stream.
export const getSynced = query.live(async function* () {
	while (true) {
		yield read('synced');
		await new Promise((f) => setTimeout(f, 1000));
	}
});
export const addSyncedOne = form(async () => {
	add('synced');
	getSynced().reconnect(); // this page sees its own +1 at once
});
