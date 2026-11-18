<script>
	import { picks } from './list.svelte.js';
</script>

<aside>
	<h2>My list</h2>
	{#each picks as book (book.id)}
		<p>{book.title}</p>
	{:else}
		<p class="empty">Nothing yet</p>
	{/each}
</aside>
