<script>
	// breadcrumbs to choose a partner, url and principle
	// every level is a GET form to /navigate, which redirects to the chosen page (works without JavaScript)
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { breadcrumbPath } from '$lib/utils/breadcrumbPath.js';
	import SelectField from '$lib/components/atoms/SelectField.svelte';
	import Icon from '$lib/components/atoms/icon.svelte';

	let { params = {}, partners = [], websites = [], principles = [] } = $props();

	// enhancement: once JavaScript runs, a choice navigates right away and the "Ga" buttons disappear
	let enhanced = $state(false);

	onMount(() => {
		enhanced = true;
	});

	// the change event of the select bubbles up to its form
	function handleChange(event) {
		goto(breadcrumbPath(new FormData(event.currentTarget)));
	}

	let partnerList = $derived(Array.isArray(partners) ? partners : partners?.websites || []);

	let selectedPartner = $derived(
		params.websiteUID ? partnerList.find(({ slug }) => slug === params.websiteUID) : null
	);

	let selectedUrl = $derived(
		params.urlUID ? (websites || []).find(({ slug }) => slug === params.urlUID) : null
	);

	// the first option of every select goes back to the overview of that level
	let partnerOptions = $derived([
		{ value: '', label: 'Partners overzicht' },
		...partnerList
			.filter((partner) => partner?.slug)
			.map(({ slug, title }) => ({ value: slug, label: title }))
	]);

	let urlOptions = $derived([
		{ value: '', label: 'URL overzicht' },
		...(websites || [])
			.filter((url) => url?.slug && url?.name)
			.map(({ slug, name }) => ({ value: slug, label: name }))
	]);

	let principleOptions = $derived([
		{ value: '', label: 'Principes overzicht' },
		...principles
			.filter((principle) => principle?.slug)
			.map(({ slug, title }) => ({ value: slug, label: title }))
	]);
</script>

<button popovertarget="filter-menu">
	Filter pagina
	<Icon iconName="filter" showIcon={true}/>
</button>

<form method="GET" action="/navigate" onchange={handleChange} popover="auto" id="filter-menu">
	<SelectField
		id="breadcrumb-partner"
		name="partner"
		label="Kies een partner"
		hideLabel={true}
		options={partnerOptions}
		value={params.websiteUID ?? ''}
	/>
	{#if !enhanced}
		<button type="submit">Ga</button>
	{/if}

	{#if selectedPartner && websites.length > 0}
		<SelectField
			id="breadcrumb-url"
			name="url"
			label="Kies een url"
			hideLabel={true}
			options={urlOptions}
			value={params.urlUID ?? ''}
		/>
		{#if !enhanced}
			<button type="submit">Ga</button>
		{/if}
	{/if}

	{#if selectedUrl && principles.length > 0}
		<SelectField
			id="breadcrumb-principle"
			name="principle"
			label="Kies een principe"
			hideLabel={true}
			options={principleOptions}
			value={params.principleUID ?? ''}
		/>
		{#if !enhanced}
			<button type="submit">Ga</button>
		{/if}
	{/if}
</form>

<style>
	button:first-of-type{
		grid-area: breadcr;
		border-radius: 4px;
		background-color: var(--color-primary-light);
		color: var(--color-neutral-black);
		height: 2.2em;
		font-weight: bold;
		padding: 0 0.6em;
		width: fit-content;
		display: flex;
		align-items: center;
		gap: var(--gap-small);
		anchor-name: --filter-btn;
	}

	button:has(+ form:popover-open) {
		border-radius: 4px 4px 0 0;
	}

	/* only when open, otherwise this overrides the browser's display: none for a closed popover */
	form:popover-open {
		display: flex;
		flex-direction: column;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--gap-small);
		position-anchor: --filter-btn;
		inset: auto;
		top: anchor(bottom);
		left: anchor(left);
		border: none;
		background-color: var(--color-primary-light);
		border-radius: 0 4px 4px 4px;

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

			&:hover {
				filter: brightness(1.1);
			}
		}
	}

	button:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 2px;
	}

	@media print {
		form {
			display: none;
		}
	}
</style>
