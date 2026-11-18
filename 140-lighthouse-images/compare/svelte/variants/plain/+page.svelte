<script>
	import { posts } from '#lib/posts.js';
</script>

<svelte:head>
	<title>Hearth Bakery: from the oven</title>
	<meta name="description" content="What came out of the bakery's oven this week, day by day." />
</svelte:head>

<header><h1>From the oven</h1><p>What Hearth Bakery baked this week</p></header>
<main>
	{#each posts as p}
		<article>
			<img src="/photos/{p.photo}.jpg" alt={p.alt} />
			<h2>{p.title}</h2>
			<p>{p.text}</p>
		</article>
	{/each}
</main>
