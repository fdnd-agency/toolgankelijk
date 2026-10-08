<script>
	// filters for the main content, every page gives its own filters from its load function
	// GET form: the choices end up in the url and the server filters the data (works without JavaScript)
	import { onMount } from 'svelte';
	import SelectField from '../molecules/selectField.svelte';

	let { filters = [] } = $props();

	// enhancement: once JavaScript runs, a choice filters right away and the "Toepassen" button disappears
	let enhanced = $state(false);

	onMount(() => {
		enhanced = true;
	});

	// SvelteKit handles a GET form as a client-side navigation, so submitting only updates the page data
	function handleChange(event) {
		event.currentTarget.requestSubmit();
	}
</script>

{#if filters.length > 0}
	<!-- noscroll + keepfocus: the page doesn't jump to the top and focus stays on the select -->
	<form
		method="GET"
		class="filters"
		aria-label="Filters"
		onchange={handleChange}
		data-sveltekit-noscroll
		data-sveltekit-keepfocus
	>
		{#each filters as filter (filter.name)}
			<!-- keeps a label and its select together when the filters wrap -->
			<div class="filter">
				<SelectField
					id="filter-{filter.name}"
					name={filter.name}
					label={filter.label}
					options={filter.options}
					value={filter.value}
				/>
			</div>
		{/each}
		{#if !enhanced}
			<button type="submit">Toepassen</button>
		{/if}
	</form>
{/if}

<style>
	.filters {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-start;
		gap: 0.5em 1em;
		flex-direction: column;

		@media (width > 740px) {
			flex-direction: row;
		}
	}

	.filter {
		display: flex;
		align-items: center;
		gap: 0.5em;
	}

	/* selects fit their content, so the filters stay next to each other */
	.filter :global(select) {
		width: auto;
	}

	button {
		height: 2.2em;
		padding: 0 0.8em;
		border: none;
		border-radius: 4px;
		background-color: var(--color-primary);
		color: var(--color-neutral-white);
		font-size: 1em;
		font-weight: bold;
		cursor: pointer;
	}

	button:hover {
		filter: brightness(1.1);
	}

	button:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 2px;
	}
</style>
