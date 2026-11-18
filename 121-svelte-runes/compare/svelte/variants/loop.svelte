<script>
	let running = $state(false);
	let elapsed = $state(0); // tenths of a second
	let laps = $state([]);
	let best = $derived(laps.length ? Math.min(...laps) : null);

	function lap() {
		laps.push(elapsed - laps.reduce((a, b) => a + b, 0));
	}

	$effect(() => {
		if (!running) return;
		const id = setInterval(() => (elapsed += 1), 100);
		return () => clearInterval(id);
	});

	// a lap by itself every 5 seconds
	$effect(() => {
		if (elapsed > 0 && elapsed % 50 === 0) lap();
	});

	const fmt = (t) => `${(t / 10).toFixed(1)} s`;
</script>

<main>
	<h1>Lap Timer</h1>
	<p class="time">{fmt(elapsed)}</p>
	<div class="buttons">
		<button onclick={() => (running = !running)}>{running ? 'Stop' : 'Start'}</button>
		<button onclick={lap} disabled={!running}>Lap</button>
	</div>
	{#if best !== null}<p class="best">Best lap: {fmt(best)}</p>{/if}
	<ol>
		{#each laps as t, i}<li>Lap {i + 1}: {fmt(t)}</li>{/each}
	</ol>
</main>
