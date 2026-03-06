<script>
	import { invalidateAll } from '$app/navigation';
	import { onMount } from 'svelte';
	import Heading from '$lib/components/heading.svelte';
	import Card from '$lib/components/card.svelte';
	import Search from '$lib/components/search.svelte';
	import Dialog from '$lib/components/dialog.svelte';
	import Pages from '$lib/components/pages.svelte';
	let { data, form } = $props();

	let skip = $derived(data.skip);
	const first = $derived(data.first);
	let totalUrls = $derived(data.websites.websitesConnection.aggregate.count);
	const currentPage = $derived(skip / first + 1);
	let showRegistrationSuccess = $derived(data.showRegistrationSuccess);
	let heading = { titel: 'Partners overzicht' };
	let dialogRef = $state();
	const principes = $derived(data.websites.principes);

	function handleDialog() {
		dialogRef.open();
	}

	function scrollToTop(event) {
		event.preventDefault();
		const mainElement = document.getElementById('heading');
		mainElement.scrollIntoView({ behavior: 'smooth' });
	}

	// check if form variable is changed and if so, invalidate the page
	onMount(() => {
		if (form?.success) {
			invalidateAll();
		}
	});
</script>


<Heading {heading} />

<section>
	<button class="add-partner" onclick={handleDialog}>Partner toevoegen</button>
	<Search placeholderProp="Gvb" />
</section>

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

<Dialog bind:this={dialogRef} isUrl={false} isType="addPartner" />

<section class="card-container">
	{#each data.websites.websites as website}
		<Card {website} {principes} isUrl={false} />
	{/each}
</section>

<a href="#main" class="btn-top" onclick={scrollToTop}>⬆</a>

<style>
	section {
		display: flex;
		justify-content: space-between;
		margin: 0 0 1em 1em;
	}

	a {
		color: rgb(40, 177, 223);
	}

	.add-partner {
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 0.25em;
		padding: 0.5em 1em;
		color: var(--c-white);
		background-color: var(--c-container);
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

	.btn-top {
		position: fixed;
		bottom: 1rem;
		right: 1rem;
		font-size: 1.3rem;
		padding: 0.4rem 0.8rem;
		background-color: var(--c-pink);
		border: none;
		color: white;
		margin-top: 1rem;
		border-radius: 4px;
		cursor: pointer;
		text-decoration: none;
	}

	.btn-top:hover {
		filter: saturate(1.2);
	}

	.card-container {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1em;
		list-style-type: none;
		margin: 0 1em;
		margin-bottom: 1em;

			@media (max-width: 700px) {
			grid-template-columns: 1fr;
		}
	}

	.toast {
		position: fixed;
		bottom: 5rem;
		right: 1rem;
		width: 10rem;
		backdrop-filter: blur(3px);
		border-radius: 4px;
		padding: 0.5rem;
		text-shadow: 0px 0px 5px black;
		animation: fade-out 4s forwards;
		z-index: 2;
	}

	.toast.success {
		background-color: #22ff0025;
		border: 1px solid #22ff00;
	}

	.toast.error {
		background-color: #a0004025;
		border: 1px solid var(--c-pink);
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
