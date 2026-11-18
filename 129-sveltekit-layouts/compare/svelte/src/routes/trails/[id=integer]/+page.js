import { error } from '@sveltejs/kit';
import { trails } from '#lib/trails.js';

export function load({ params }) {
	const trail = trails.find((t) => t.id === params.id);
	if (!trail) error(404, 'No such trail');
	return { trail };
}
