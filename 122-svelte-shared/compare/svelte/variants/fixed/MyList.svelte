<script>
	import { club } from './list.svelte.js';
</script>

<aside>
	<h2>My list</h2>
	{#each club.picks as book (book.id)}
		<p>{book.title}</p>
	{:else}
		<p class="empty">Nothing yet</p>
	{/each}
</aside>
