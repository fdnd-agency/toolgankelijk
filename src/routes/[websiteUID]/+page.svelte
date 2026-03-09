<script>
	import { page } from '$app/stores';
	import Heading from '$lib/components/heading.svelte';
	import Card from '$lib/components/card.svelte';
	import Search from '$lib/components/search.svelte';
	import Dialog from '$lib/components/dialog.svelte';
	import Pages from '$lib/components/pages.svelte';
	import AddCard from '$lib/components/addCard.svelte';

	let { data, form } = $props();

	let skip = $derived(data.skip);
	const first = $derived(data.first);
	let totalUrls = $derived(data.websites.urlsConnection.aggregate.count);
	const currentPage = $derived(skip / first + 1);
	let heading = $derived({
		titel: data.websites.website.titel,
		homepage: data.websites.website.homepage
	});
	let websites = $derived(data.websites.website.urls);
	let overzicht = $derived(data.websites.website);
	let params = $derived($page.params.websiteUID);

	let dialogRef = $state();
	const principes = $derived(data.websites.principes);

	function handleDialog() {
		dialogRef.open();
	}
</script>

<Heading {heading} />

<section>
	<button class="add-partner" onclick={handleDialog}>Url toevoegen</button>
	<Search placeholderProp="Home" />
</section>

{#if totalUrls > first}
<section>
	<Pages amount={totalUrls} perPage={first} {currentPage} />
</section>
{/if}

{#if form?.success}
	<div class="toast"><p>{form?.message}</p></div>
{:else if form?.success == false}
	<div class="toast"><p>{form?.message}</p></div>
{/if}

<Dialog bind:this={dialogRef} {params} isType="addUrl" />

<section class="cards-container">
	{#each websites as website}
		<Card {website} {overzicht} {params} {principes} isUrl={true} />
	{/each}
	<AddCard />
</section>

<style>
	section {
		display: flex;
		justify-content: space-between;
		margin: 0 0 1em 1em;
	}

	.add-partner {
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 0.25em;
		padding: 0.5em 1em;
		color: var(--c-white2);
		background-color: var(--c-modal-button);
		border: none;
		font-weight: 600;
		font-size: 1em;
		transition: 0.3s;
		cursor: pointer;
		text-decoration: none;
	}

	.add-partner:hover {
		background-color: var(--c-pink);
	}

	.cards-container {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1em;
		list-style-type: none;
		margin: 0 1em;

		@media (max-width: 720px) {
			grid-template-columns: 1fr;
		}
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
