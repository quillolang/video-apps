<script>
	let { error } = $props();
</script>

<svelte:head><title>Trail not found · Trail Guide</title></svelte:head>

<a href="/trails">← All trails</a>
<h1 class="missing">{error.status}: That trail isn't in the guide</h1>
<p>Try the list: six trails, numbered 1 to 6.</p>
