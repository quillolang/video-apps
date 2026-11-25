<!-- Six kinds of state on one page, each with a +1. -->
<script lang="ts">
	import { page } from '$app/state';
	import * as data from './data.remote';

	let tab = $state(0);
	const address = $derived(Number(page.url.searchParams.get('n') ?? 0));
</script>

<svelte:head><title>Where state lives</title></svelte:head>

<h1>Where state lives</h1>
<button id="tab" onclick={() => tab++}>This tab: {tab}</button>
<a id="address" href="?n={address + 1}">The address: {address}</a>
<form {...data.addVisitorOne}>
	<button id="visitor">This visitor: {await data.getVisitor()}</button>
</form>
<form {...data.addEveryoneOne}>
	<button id="everyone">Everyone, until a restart: {await data.getEveryone()}</button>
</form>
<form {...data.addSavedOne}>
	<button id="saved">Everyone, for good: {await data.getSaved()}</button>
</form>
<form {...data.addSyncedOne}>
	<button id="synced">Kept in sync: {await data.getSynced()}</button>
</form>

<style>
	:global(body) { font: 18px system-ui; margin: 24px; background: #f6f3ee; }
	h1 { font-size: 26px; }
	button, a { display: block; box-sizing: border-box; width: 340px; margin: 8px 0; padding: 10px 14px; font: inherit;
		text-align: left; background: #fff; border: 2px solid #6b4eff; border-radius: 10px; color: #222;
		text-decoration: none; cursor: pointer; }
	form { margin: 0; }
</style>
