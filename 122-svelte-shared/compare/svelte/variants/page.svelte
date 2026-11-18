<script>
	import { books } from '#lib/books.js';
	import Header from '#lib/Header.svelte';
	import BookCard from '#lib/BookCard.svelte';
	import MyList from '#lib/MyList.svelte';
</script>

<Header />
<div class="club">
	<ul class="books">
		{#each books as book (book.id)}
			<BookCard {book} />
		{/each}
	</ul>
	<MyList />
</div>
