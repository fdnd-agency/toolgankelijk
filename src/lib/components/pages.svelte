<script>
	let { amount, perPage, currentPage } = $props();

	// calculate the number of pages
	let pageCount = $derived(Math.ceil(amount / perPage));

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
	// Amount of buttons to show
	let pageNumbers = $derived(getPages());
	// calculate the skip values for the previous and next buttons
	let prevSkip = $derived(Math.max((currentPage - 2) * perPage, 0));
	let nextSkip = $derived(Math.min(currentPage * perPage, (pageCount - 1) * perPage));
</script>

<form method="GET" data-sveltekit-reload>
	<ul class="pages-list">
		<li>
		<NavButton name="skip" type="submit" value={prevSkip} size="medium" variant="primary" showIcon={false} disabled={currentPage === 1}>
			<p> Vorige </p>
		</NavButton>
		</li>

		{#each pageNumbers as p}
			{#if p === '...'}
				<li class="button-disabled button">...</li>
			{:else}
				<li>
				<NavButton type="submit" value={(p - 1) * perPage} size="medium" variant="primary" showIcon={false} disabled={currentPage === pageCount}>
					<p> {p} </p>
				</NavButton>
				</li>
			{/if}
		{/each}

		<!-- <li class="button-disabled button">{pageCount}</li> -->
		<li>
		<NavButton type="submit" value={nextSkip} size="medium" variant="primary" showIcon={false} disabled={currentPage === pageCount}>
			<p> Volgende </p>
		</NavButton>
		</li>
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

	.button:disabled {
		cursor: default;
		opacity: 0.5;
	}
</style>
