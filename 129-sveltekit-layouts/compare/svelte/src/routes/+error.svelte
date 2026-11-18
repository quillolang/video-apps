<script>
	let { error } = $props();
</script>

<svelte:head><title>{error.message} · Trail Guide</title></svelte:head>

<a href="/">← Home</a>
<h1 class="missing">{error.status}: {error.message}</h1>
