<script>
	import { trails } from '#lib/trails.js';
</script>

<svelte:head><title>Trails · Trail Guide</title></svelte:head>

<h1>Trails</h1>
<ul>
	{#each trails as t (t.id)}
		<li><a href="/trails/{t.id}">{t.name}</a></li>
	{/each}
</ul>
