// The books on my list, shared by every component that imports them.
export let picks = $state([]);

export function add(book) {
	picks = [...picks, book];
}
