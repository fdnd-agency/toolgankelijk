<script>
    export let amount;
	export let perPage;
	export let currentPage;

	// calculate the amount of pages on basis of the total urls
	$: pageCount = Math.ceil(amount / perPage);

	// calculate the amount of buttons shown per block
	const windowSize = 5;
	$: mod = currentPage % windowSize;

	// decide which block-index we should be showing
	$: blockIndex = (() => {
		if (currentPage === pageCount) {
			return Math.floor((pageCount - 1) / windowSize);
		}
		// last in a block? (5,10,15…)
		if (mod === 0) {
		return currentPage / windowSize;
		}
		// first of a higher block? (6,11,16…)
		if (mod === 1 && currentPage > windowSize) {
		return Math.floor((currentPage - 1) / windowSize) - 1;
		}
		// otherwise stick with your “natural” block
		return Math.floor((currentPage - 1) / windowSize);
	})();

	// compute the range [startPage…endPage]
	$: startPage = blockIndex * windowSize + 1;
	$: endPage   = Math.min(startPage + windowSize - 1, pageCount);

	// now build [startPage, startPage+1, …, endPage]
	$: pageNumbers = Array.from(
		{ length: endPage - startPage + 1 },
		(_, i) => startPage + i
	);
</script>

<ul class="pages-list">
    {#each pageNumbers as p}
    <li><button type="submit" name="skip" value={(p - 1) * perPage} class:selected={p === currentPage}>{p}</button></li>
    {/each}
	{#if pageCount > windowSize}
	<li class="button-preview">...</li>
	{/if}
</ul>

<style>
    .pages-list {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		gap: 0.5rem;
        list-style-type: "";
	}

	.pages-list li button {
		border-radius: 0.25em;
		padding: 0.5em 1em;
		color: var(--c-white2);
		background-color: var(--c-modal-button);
		border: none;
		font-weight: 600;
		font-size: 1em;
		transition: 0.3s;
		cursor: pointer;
	}

	.button-preview {
		border-radius: 0.25em;
		padding: 0.5em 1em;
		color: var(--c-white2);
		background-color: var(--c-modal-button);
		border: none;
		font-weight: 600;
		font-size: 1em;
		transition: 0.3s;
		cursor: pointer;
		opacity: 0.5;
	}

	.pages-list li button:hover {
		background-color: var(--c-pink);
	}

	.pages-list li .selected {
		font-weight: 900;
		background-color: var(--c-pink);
	}
</style>