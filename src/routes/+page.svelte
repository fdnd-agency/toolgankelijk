<script>
	import { invalidateAll } from '$app/navigation';
	import { onMount } from 'svelte';
	import Card from '$lib/components/templates/card.svelte';
	import Search from '$lib/components/moleculues/search.svelte';
	import Dialog from '$lib/components/templates/dialog.svelte';
	import Pages from '$lib/components/organisms/pages.svelte';
	import NavButton from '$lib/components/moleculues/navButton.svelte';
	import Heading from '$lib/components/moleculues/heading.svelte';

	let { data, form } = $props();

	let skip = $derived(data.skip);
	const first = $derived(data.first);
	let totalUrls = $derived(data.totalWebsites);
	const currentPage = $derived(skip / first + 1);
	let showRegistrationSuccess = $derived(data.showRegistrationSuccess);
	let heading = { title: 'Partners overzicht' };
	let dialogRef = $state();
	const principles = $derived(data.principles);

	function handleDialog() {
		dialogRef.open();
	}

	function scrollToTop(event) {
		event.preventDefault();
		const mainElement = document.getElementById('heading');
		mainElement.scrollIntoView({ behavior: 'smooth' });
	}

	onMount(() => {
		if (form?.success) {
			invalidateAll();
		}
	});
</script>

<Heading {heading} />

<section>
	<NavButton
		aria="Partner Toevogen"
		size="xlarge"
		variant="primary"
		showIcon={true}
		onclick={handleDialog}
		iconName="add"
	>
		<p>Partner Toevoegen</p>
	</NavButton>

	<Search placeholderProp="Gvb" />
</section>

{#if showRegistrationSuccess}
	<div class="toast success"><p>Account succesvol aangemaakt!</p></div>
{/if}

{#if form?.success}
	<div class="toast success"><p>{form?.message}</p></div>
{:else if form?.success == false}
	<div class="toast error"><p>{form?.message}</p></div>
{/if}

<Dialog bind:this={dialogRef} isUrl={false} isType="addPartner" />

<section class="card-container">
	{#each data.websites as website}
		<Card {website} {principles} isUrl={false} />
	{/each}

	{#if totalUrls > first}
		<Pages amount={totalUrls} perPage={first} {currentPage} />
	{/if}
</section>

<div class="scroll-to-top-wrapper">
	<NavButton
		size="small"
		variant="primary"
		showIcon={true}
		iconName="arrow"
		href="#main"
		aria="scroll naar boven"
	></NavButton>
</div>

<style>
	section {
		display: flex;
		justify-content: space-between;
		margin: 0 0 1em 1em;
	}

	.card-container {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1em;
		list-style-type: none;
		margin: 0 1em;
		margin-bottom: 1em;

		@media (max-width: 1080px) {
			grid-template-columns: 1fr;
		}
	}

	.scroll-to-top-wrapper {
		position: relative;
		padding: 1em;
		z-index: 3;
		transform: rotate(180deg);
	}

	.toast {
		position: fixed;
		bottom: 5rem;
		right: 1rem;
		width: 12rem;
		backdrop-filter: blur(8px);
		border-radius: var(--border-radius);
		padding: 0.75rem;

		/* Removed hardcoded black shadow for better theme support */
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		animation: fade-out 4s forwards;
		z-index: 2;

		p {
			color: var(--color-neutral-black);
			font-weight: 500;
		}

		&.success {
			background-color: hsla(168, 65%, 41%, 0.2);
			border: 1px solid var(--color-accent-primary);
		}

		&.error {
			background-color: hsla(336, 100%, 45%, 0.2);
			border: 1px solid var(--color-primary);
		}
	}

	@keyframes fade-out {
		from {
			transform: translateX(30vh);
			opacity: 1;
		}
		10% {
			transform: translateX(0);
			opacity: 1;
		}
		80% {
			transform: translateX(0);
			opacity: 1;
		}
		to {
			transform: translateX(30vh);
			opacity: 0;
		}
	}
</style>
