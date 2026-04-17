<script>
	import { page } from '$app/stores';
	import Card from '$lib/components/card.svelte';
	import Dialog from '$lib/components/dialog.svelte';
	import Pages from '$lib/components/pages.svelte';
	import Heading from '$lib/components/heading.svelte';
	import SubHeader from '$lib/components/subheader.svelte';

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
    let principles = $derived(data.principles || []);
	let currentUrls = $derived(overview?.urls ?? []);

	let heading = $derived({
        title: overview?.title ?? 'Onbekende website',
        homepage: overview?.homepage ?? ''
    });

	let dialogRef = $state();

	function openAddUrl() {
        dialogRef?.open();
    }
</script>

<SubHeader 
    {params} 
    partners={partners}
    websites={currentUrls} 
    {principles}
    {overview} 
    user={data.user}
    showAdd={true}
    onAdd={openAddUrl} 
/>

<Dialog bind:this={dialogRef} params={params.websiteUID} isType="addUrl" />
<Heading {heading} />


<section class="cards-container">
{#each currentUrls as website}
		<Card 
            {website} 
            {overview}
            {params} 
            {principles} 
            isUrl={true} 
        />
    {/each}
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
