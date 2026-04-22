<script>
	let { amount, perPage, currentPage } = $props();
	import NavButton from '../moleculues/navButton.svelte';

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
			<NavButton
				type="submit"
				name="skip"
				value={prevSkip}
				disabled={currentPage === 1}
				size="medium"
				variant="primary"
			>
				<p>Vorige</p>
			</NavButton>
		</li>

		{#each pageNumbers as p}
			{#if p === '...'}
				<li class="button-disabled button">
					<NavButton
					size="small"
					>
						...
					</NavButton>
				</li>
			{:else}
				<li>
					<NavButton
					size="small"
					variant="primary" 
					type="submit" 
					name="skip" 
					class={p === currentPage ? 'selected' : ''} 
					effect="pages"
					disabled={p === currentPage} 
					value={(p - 1) * perPage}
					>
						<NavButton
						size="small">
							{p}
						</NavButton>
					</NavButton>
				</li>
			{/if}
		{/each}

		<!-- <li class="button-disabled button">{pageCount}</li> -->

		<li>
			<NavButton
				type="submit"
				name="skip"
				value={nextSkip}
				disabled={currentPage === pageCount}
				size="medium"
				variant="primary"
			>
				<p>Volgende</p>
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
</style>
