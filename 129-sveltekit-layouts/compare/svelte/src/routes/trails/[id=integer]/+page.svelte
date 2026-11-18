<script>
	let { data } = $props();
</script>

<svelte:head><title>{data.trail.name} · Trail Guide</title></svelte:head>

<a href="/trails">← All trails</a>
<h1>{data.trail.name}</h1>
<p class="facts">{data.trail.km} km · {data.trail.climb} m climb · {data.trail.level}</p>
