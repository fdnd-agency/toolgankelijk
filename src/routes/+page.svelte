<script>
	import { page } from '$app/stores';
	import { invalidateAll } from '$app/navigation';
	import { onMount } from 'svelte';
	import Card from '$lib/components/templates/card.svelte';
	import SubHeader from '$lib/components/templates/subheader.svelte';
	import Dialog from '$lib/components/templates/dialog.svelte';
	import Pages from '$lib/components/organisms/pages.svelte';
	import NavButton from '$lib/components/molecules/navButton.svelte';

	let { data, form } = $props();

	let params = $derived($page.params);
	let partners = $derived(data.partnersData);

	let skip = $derived(data.skip);
	const first = $derived(data.first);
	let totalUrls = $derived(data.totalWebsites);
	const websitesList = $derived(data.websites.allWebsites || []);
	const currentPage = $derived(skip / first + 1);
	let showRegistrationSuccess = $derived(data.showRegistrationSuccess);
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

<Dialog bind:this={dialogRef} {params} isType="addPartner" />

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
		size="small"
		variant="primary"
		showIcon={true}
		iconName="arrow"
		href="#main"
		aria-label="scroll naar boven"
		onClick={scrollToTop}
	></NavButton>
</div>

<style>
	section {
		display: flex;
		justify-content: space-between;
	}

	.scroll-color-override {
		display: flex;
		justify-content: flex-end;
	}


	.card-container {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2em;
		list-style-type: none;

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
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		animation: fade-out 4s forwards;
		z-index: 2;
	}

	.toast p {
		color: var(--color-neutral-black);
		font-weight: 500;
	}

	.toast.success {
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
