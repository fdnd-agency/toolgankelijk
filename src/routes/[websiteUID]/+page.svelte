<script>
	import { page } from '$app/stores';
	import Card from '$lib/components/templates/card.svelte';
	import Pages from '$lib/components/organisms/pages.svelte';
	import SubHeader from '$lib/components/templates/subheader.svelte';
	import FormOverlay from '$lib/components/templates/formOverlay.svelte';
	import AddForm from '$lib/components/organisms/addForm.svelte';

	let { data, form } = $props();
	let params = $derived($page.params);

	const globalWebsites = Array.isArray(data.websitesData) ? data.websitesData : [];

	// pages
	let skip = $derived(data.skip);
	const first = $derived(data.first);
	const currentPage = $derived(skip / first + 1);
	let totalUrls = $derived(data.websites.totalUrls);

	// overview
	let overview = $derived(data.websites?.website);
	let partners = $derived(data.partnersData || []);
	let principles = $derived(data.websites?.principles || []);
	let currentUrls = $derived(overview?.urls ?? []);

	let heading = $derived({
		title: overview?.title ?? 'Onbekende website',
		homepage: overview?.homepage ?? ''
	});

	// ?add in the url opens the add form, it stays open when saving failed
	let showAddForm = $derived($page.url.searchParams.has('add') || form?.success === false);
</script>

{#if showAddForm}
	<FormOverlay title="Url toevoegen" closeHref="/{params.websiteUID}">
		<AddForm action="?/addUrl" nameLabel="Pagina titel" urlLabel="Pagina url" />
	</FormOverlay>
{/if}

{#if form?.success}
	<div class="toast"><p>{form?.message}</p></div>
{:else if form?.success == false}
	<div class="toast"><p>{form?.message}</p></div>
{/if}

<!-- all the cards are shown on this page -->
<section class="cards-container">
	{#each currentUrls as website}
		<Card {website} {overview} {params} {principles} isUrl={true} />
	{/each}

	<!-- this is the pagnation of the url/partners -->
	{#if totalUrls > first}
		<Pages amount={totalUrls} perPage={first} {currentPage} />
	{/if}
</section>

<style>
	section {
		display: flex;
		justify-content: space-between;
		margin: 0 0 1em 1em;
	}

	.cards-container {
		display: flex;
		flex-direction: column;
		gap: 1em;
		list-style-type: none;
		margin: 0 1em;
	}

	.toast {
		position: fixed;
		bottom: 5rem;
		right: 1rem;
		height: 4rem;
		width: 10rem;
		background-color: #a0004025;
		backdrop-filter: blur(3px);
		border: 1px solid var(--c-pink);
		border-radius: 4px;
		padding: 0.5rem;
		text-shadow: 0px 0px 10px black;
		animation: fade-out 4s forwards;
		z-index: 2;
	}

	@keyframes fade-out {
		from {
			transform: translateX(30vh);
			display: block;
		}
		10% {
			transform: translateX(0);
			display: block;
		}
		80% {
			transform: translateX(0);
			display: block;
		}
		to {
			transform: translateX(30vh);
			display: none;
		}
	}
</style>
