<script>
	import { picks } from './list.svelte.js';
</script>

<header>
	<h1>Book Club</h1>
	<p class="count">📚 {picks.length} on my list · {picks.reduce((sum, b) => sum + b.pages, 0)} pages</p>
</header>
