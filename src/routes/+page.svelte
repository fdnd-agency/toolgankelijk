<script>
	import { page } from '$app/stores';
	import { invalidateAll } from '$app/navigation';
	import { onMount } from 'svelte';
	import Card from '$lib/components/templates/card.svelte';
	import SubHeader from '$lib/components/templates/subheader.svelte';
	import Dialog from '$lib/components/templates/dialog.svelte';
	import Pages from '$lib/components/organisms/pages.svelte';
	import NavButton from '$lib/components/molecules/navButton.svelte';
	import Heading from '$lib/components/molecules/heading.svelte';

	let { data, form } = $props();

	let params = $derived($page.params);
	let partners = $derived(data.partnersData);

	let skip = $derived(data.skip);
	const first = $derived(data.first);
	let totalUrls = $derived(data.totalWebsites);
	const websitesList = $derived(data.websites.allWebsites || []);
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

	function openAddUrl() {
		dialogRef?.open();
	}
</script>

<SubHeader
	{params}
	{partners}
	websites={websitesList}
	{principles}
	user={data.user}
	showAdd={true}
	onAdd={openAddUrl}
/>

<Dialog bind:this={dialogRef} {params} isType="addPartner" />

<Heading {heading} />

{#if totalUrls > first}
	<Pages amount={totalUrls} perPage={first} {currentPage} />
{/if}

{#if showRegistrationSuccess}
	<div class="toast success"><p>Account succesvol aangemaakt!</p></div>
{/if}

{#if form?.success}
	<div class="toast success"><p>{form?.message}</p></div>
{:else if form?.success == false}
	<div class="toast error"><p>{form?.message}</p></div>
{/if}

<section class="card-container">
	{#each data.websites as website}
		<Card {website} {principles} isUrl={false} />
	{/each}
</section>

<div class="scroll-color-override">
	<NavButton
		size="medium"
		variant="primary"
		showIcon={false}
		href="#main"
		aria-label="scroll naar boven"
		onClick={scrollToTop}
	>
		<p>⬆</p>
	</NavButton>
</div>

<style>
	section {
		display: flex;
		justify-content: space-between;
		margin: 0 0 1em 1em;
	}

	a {
		/* Replaced hardcoded blue with accent-tertiary (closest match) */
		color: var(--color-accent-tertiary);
	}

	.add-partner {
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: var(--border-radius); /* Using global radius */
		padding: 0.5em 1em;
		/* Using neutral-black because it flips to white in dark mode automatically */
		color: var(--color-neutral-black);
		background-color: var(--color-primary-light);
		border: none;
		font-weight: 600;
		font-size: 1em;
		transition: 0.3s;
		cursor: pointer;
		text-decoration: none;
	}

	.add-partner:hover {
		/* Using primary color for hover state */
		background-color: var(--color-primary);
	}

	.btn-top {
		position: fixed;
		bottom: 1rem;
		right: 1rem;
		font-size: 1.3rem;
		padding: 0.4rem 0.8rem;
		/* Replaced var(--c-pink) with semantic primary */
		background-color: var(--color-primary);
		border: none;
		color: var(--color-neutral-black);
		margin-top: 1rem;
		border-radius: 4px;
		cursor: pointer;
		text-decoration: none;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
	}

	.scroll-color-override > :global(.navbutton) {
		background-color: #c7337f !important;
	}

	.btn-top:hover {
		filter: brightness(1.2);
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
	}

	.toast p {
		color: var(--color-neutral-black);
		font-weight: 500;
	}

	.toast.success {
		/* Using the green HSL values from your global CSS for consistency */
		background-color: hsla(168, 65%, 41%, 0.2);
		border: 1px solid var(--color-accent-primary);
	}

	.toast.error {
		background-color: hsla(336, 100%, 45%, 0.2);
		border: 1px solid var(--color-primary);
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
