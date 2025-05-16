<script>
	export let amount;
	export let perPage;
	export let currentPage;

	// calculate the number of pages
	let pageCount =  Math.ceil(amount / perPage);

	// Amount of buttons to show
	$: pageNumbers = getPages();

	// calculate the skip values for the previous and next buttons
	$: prevSkip = Math.max((currentPage - 2) * perPage, 0);
  	$: nextSkip = Math.min(currentPage * perPage, (pageCount - 1) * perPage);

	// calculate the skip values for the pageNumbers buttons
	function getPages() {
		const pages = [];
		if (pageCount <= 5) {
			for (let i = 1; i <= pageCount; i++) {
				pages.push(i);
			}
		} else if (currentPage <= 3) {
			for (let i = 1; i <= 5; i++) {
				pages.push(i);
			}
			pages.push('...');
		} else if (currentPage >= pageCount - 2) {
			pages.push('...');
			for (let i = pageCount - 3; i <= pageCount; i++) {
				if (i > 0 && i <= pageCount) pages.push(i);
			}
		} else {
			pages.push('...');
			for (let i = currentPage - 1; i <= currentPage + 1; i++) {
				if (i > 0 && i <= pageCount) pages.push(i);
			}
			pages.push('...');
		}
		return pages;
	}
</script>

<form method="GET" data-sveltekit-reload>
<ul class="pages-list">
	<li><button type="submit" class="button" name="skip" value={prevSkip} disabled={currentPage === 1}>◀ Vorige</button></li>

	{#each pageNumbers as p}
		{#if p === "..."}
			<li class="button-disabled button">...</li>
		{:else}
			<li>
				<button
					type="submit"
					class="button"
					name="skip"
					value={(p - 1) * perPage}
					class:selected={p === currentPage}
					>{p}
				</button>
			</li>
		{/if}
	{/each}

	<!-- <li class="button-disabled button">{pageCount}</li> -->
	<li><button type="submit" class="button" name="skip" value={nextSkip} disabled={currentPage === pageCount}>Volgende ▶</button></li>
</ul>
</form>

<style>
	form {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 1rem;
		margin-left: 1rem;
	}
	
	.pages-list {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.5rem;
		list-style: none;
		padding: 0;
	}

	.button {
		border-radius: 0.25rem;
		padding: 0.5rem 1rem;
		background-color: var(--c-modal-button);
		color: var(--c-white2);
		border: none;
		cursor: pointer;
		transition: 0.3s;
		font-size: 1rem;
	}

	.button:hover {
		background-color: var(--c-pink);
	}

	.button-disabled {
		opacity: 0.5;
	}

	.selected {
		background-color: var(--c-pink);
		font-weight: 900;
	}

	.button:disabled {
		cursor: default;
		opacity: 0.5;
	}
</style>
