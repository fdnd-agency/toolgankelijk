<script>
	export let amount;
	export let perPage;
	export let currentPage;

	$: pageCount = Math.ceil(amount / perPage);

	function getPages() {
		let pages = [];

		// always show first page
		pages.push(1);

		if (pageCount <= 6) {
			// just show all pages if few
			for (let i = 2; i < pageCount; i++) {
				pages.push(i);
			}
		} else if (currentPage <= 4) {
			// near the start
			for (let i = 2; i <= 5; i++) {
				pages.push(i);
			}
			pages.push("...");
		} else if (currentPage >= pageCount - 3) {
			// near the end
			pages.push("...");
			for (let i = pageCount - 4; i < pageCount; i++) {
				pages.push(i);
			}
		} else {
			// in the middle
			pages.push("...");
			pages.push(currentPage - 1);
			pages.push(currentPage);
			pages.push(currentPage + 1);
			pages.push("...");
		}

		// always show last page
		if (pageCount > 1) {
			pages.push(pageCount);
		}

		return pages;
	}

	$: pageNumbers = getPages();
</script>

<ul class="pages-list">
	<li><button type="submit" class="button" name="skip" value={(currentPage - 2) * perPage} disabled={currentPage === 1}>◀ Vorige</button></li>

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
				>{p}</button>
			</li>
		{/if}
	{/each}

	<li class="button-disabled button">{amount}</li>
	<li><button type="submit" class="button" name="skip" value={currentPage * perPage} disabled={currentPage === pageCount}>Volgende ▶</button></li>
</ul>

<style>
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
