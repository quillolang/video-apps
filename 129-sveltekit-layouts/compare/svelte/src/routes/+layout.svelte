<script>
	import '../app.css';
	import favicon from '#lib/assets/favicon.svg';
	import { page } from '$app/state';

	let { children } = $props();
	const links = [
		['/', 'Home'],
		['/trails', 'Trails'],
		['/about', 'About']
	];
	const here = (href) => (href === '/' ? page.url.pathname === '/' : page.url.pathname.startsWith(href));
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<header>
	<a class="brand" href="/">Trail Guide</a>
	<nav>
		{#each links as [href, label] (href)}
			<a {href} class={{ here: here(href) }}>{label}</a>
		{/each}
	</nav>
</header>
<main>
	{@render children()}
</main>
<footer>Six trails, all within an hour of town.</footer>
