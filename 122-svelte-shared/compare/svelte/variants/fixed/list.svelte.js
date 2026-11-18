// The books on my list, shared by every component that imports them.
export const club = $state({ picks: [] });

export function pages() {
	return club.picks.reduce((sum, b) => sum + b.pages, 0);
}

export function add(book) {
	club.picks.push(book);
}
