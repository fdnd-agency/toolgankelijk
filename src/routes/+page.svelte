<script>
	import { onMount } from 'svelte';
	import Heading from '$lib/components/heading.svelte';
	import Partner from '$lib/components/partner.svelte';
	import Search from '$lib/components/search.svelte';
	import PartnerForm from '$lib/components/partnerForm.svelte';

	export let data;
	export let form;

	let closeButton;
	let dialogRef;
	let heading = { titel: 'Partners overzicht' };
	const principes = data.principes;

	function openDialog(el) {
		let dialog = document.querySelector('dialog');
		dialog.showModal();
		el.preventDefault();
	}

	function scrollToTop(event) {
		event.preventDefault();
		const mainElement = document.getElementById('main');
		mainElement.scrollIntoView({ behavior: 'smooth' });
	}

	onMount(() => {
		closeButton = document.querySelector('dialog button');
		dialogRef = document.querySelector('dialog');

		dialogRef.addEventListener('click', (event) => {
			if (event.target === dialogRef) {
				dialogRef.close();
			}
		});

		closeButton.addEventListener('click', () => {
			dialog.close();
		});
	});
</script>

<Heading {heading} />

<section>
	<a class="add-partner" href="/addPartner" on:click={openDialog}>Partner toevoegen</a>
	<Search placeholderProp="Gvb" />
</section>

{#if form?.success}
	<div class="toast"><p>{form?.message}</p></div>
{:else if form?.success == false}
	<div class="toast"><p>{form?.message}</p></div>
{/if}

<dialog><PartnerForm /></dialog>

<ul>
	{#each data.websites as website}
		<Partner {website} {principes} />
	{/each}
</ul>

<a href="#main" class="btn-top" on:click={scrollToTop}>⬆</a>

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

	ul {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(20em, 1fr));
		gap: 1em;
		list-style-type: none;
		margin: 0 1em;
		margin-bottom: 1em;
	}

	dialog {
		background-color: var(--c-container);
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		overflow: visible;
		width: 100%;
		max-width: 30em;
		border: none;
		display: none;
	}

	dialog[open] {
		display: block;
	}

	dialog::backdrop {
		background-color: rgb(44, 44, 44);
		opacity: 0.8;
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
