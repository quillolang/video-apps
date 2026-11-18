<script>
	import { enhance } from '$app/forms';

	let { data } = $props();
	let left = $derived(data.items.filter((item) => !item.bought).length);
</script>

<main>
	<h1>Groceries</h1>
	<p class="left">{left} to buy</p>
	<ul>
		{#each data.items as item (item.id)}
			<li class:bought={item.bought}>
				<form method="POST" action="?/toggle" use:enhance>
					<input type="hidden" name="id" value={item.id} />
					<button>{item.bought ? '✓' : ''}</button>
				</form>
				<span>{item.name}</span>
			</li>
		{/each}
	</ul>
	<form class="add" method="POST" action="?/add" use:enhance>
		<input name="name" placeholder="Add an item" autocomplete="off" />
		<button>Add</button>
	</form>
</main>
