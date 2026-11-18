<script>
	import { club, pages } from './list.svelte.js';
</script>

<header>
	<h1>Book Club</h1>
	<p class="count">📚 {club.picks.length} on my list · {pages} pages</p>
</header>
