<script>
	import Heading from '$lib/components/heading.svelte';
	import Partner from '$lib/components/partner.svelte';
	import Search from '$lib/components/search.svelte';
	import AddForm from '$lib/components/addForm.svelte';
	import Pages from '$lib/components/pages.svelte';

	export let data;
	export let form;

	let skip = data.skip;
	const first = data.first;
	let totalUrls = data.websites.totalUrls;
	const currentPage = skip / first + 1;

	let heading = { titel: 'Partners overzicht' };
	let dialogRef;
	const principes = data.websites.principes;

	function handleDialog() {
		dialogRef.open();
	}

	function scrollToTop(event) {
		event.preventDefault();
		const mainElement = document.getElementById('main');
		mainElement.scrollIntoView({ behavior: 'smooth' });
	}
</script>

<Heading {heading} />

<section>
	<button class="add-partner" on:click={handleDialog}>Partner toevoegen</button>
	<Search placeholderProp="Gvb" />
</section>

{#if (totalUrls > first)}
<Pages amount={totalUrls} perPage={first} currentPage={currentPage}/>
{/if}

{#if form?.success}
	<div class="toast"><p>{form?.message}</p></div>
{:else if form?.success == false}
	<div class="toast"><p>{form?.message}</p></div>
{/if}

<AddForm bind:this={dialogRef} isUrl={false}/>

<ul>
	{#each data.websites.websites as website}
		<Partner {website} {principes} isUrl={false} />
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
