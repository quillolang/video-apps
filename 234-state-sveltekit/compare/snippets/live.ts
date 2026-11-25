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
