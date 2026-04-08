<script>
	import { page } from '$app/stores';
	import Card from '$lib/components/card.svelte';
	import Search from '$lib/components/search.svelte';
	import Dialog from '$lib/components/dialog.svelte';
	import Pages from '$lib/components/pages.svelte';
	import NavButton from '$lib/components/NavButton.svelte';
	import Heading from '$lib/components/heading.svelte';

	let { data, form } = $props();

	let skip = $derived(data.skip);
	const first = $derived(data.first);
	let totalUrls = $derived(data.websites.totalUrls);
	const currentPage = $derived(skip / first + 1);
	let heading = $derived({
		title: data.websites.website?.title ?? 'Onbekende website',
		homepage: data.websites.website?.homepage ?? ''
	});
	let websites = $derived(data.websites.website?.urls ?? []);
	let overview = $derived(data.websites.website);
	let params = $derived($page.params.websiteUID);
	let dialogRef = $state();
	const principles = $derived(data.websites.principles);

	function handleDialog() {
		dialogRef.open();
	}
</script>

<Heading {heading}/>

<section>
	<NavButton
		aria="Url Toevoegen"
		size="large"
		variant="primary"
		showIcon={false}
		onclick={handleDialog}
		iconName="add"
	>
		<p>URL Toevoegen</p>
	</NavButton>

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
		<Card {website} {overview} {params} {principles} isUrl={true} />
	{/each}
</section>

<style>
	section {
		display: flex;
		justify-content: space-between;
		margin: 0 0 1em 1em;
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
