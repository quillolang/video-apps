<script>
	import { add } from './list.svelte.js';

	let { book } = $props();
</script>

<li>
	<b>{book.title}</b>
	<span>{book.author} · {book.pages} pages</span>
	<button onclick={() => add(book)}>Add to my list</button>
</li>
