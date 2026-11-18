<script>
	import { enhance } from '$app/forms';
	import { getItems } from './groceries.remote.js';

	let items = $derived(await getItems());
	let left = $derived(items.filter((item) => !item.bought).length);
</script>

<main>
	<h1>Groceries</h1>
	<p class="left">{left} to buy</p>
	<ul>
		{#each items as item (item.id)}
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
