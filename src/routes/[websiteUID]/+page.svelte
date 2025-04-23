<script>
	import { page } from '$app/stores';
	import Heading from '$lib/components/heading.svelte';
	import Partner from '$lib/components/partner.svelte';
	import Search from '$lib/components/search.svelte';
	import AddForm from '$lib/components/addForm.svelte';
	import Pages from '$lib/components/pages.svelte';

	export let data;
	export let form;

	let skip = data.skip;
	let skipInput;
	const first = data.first;
	const hasPrevious = skip > 0;
	const hasNext = data.websitesData.website.urls.length === first;
	let totalUrls = data.totalUrls;

	$: heading = {
		titel: data.websitesData.website.titel,
		homepage: data.websitesData.website.homepage
	};
	$: websites = data.websitesData.website.urls;
	$: overzicht = data.websitesData.website;
	$: params = $page.params.websiteUID;

	let dialogRef;
	const principes = data.partnersData.principes;

	function handleDialog() {
		dialogRef.open();
	}

	function handleSubmit(event) {
		const form = event.target;
		const button = event.submitter;

		if (button.name === 'skip-previous') {
			skipInput.value = Math.max(skip - first, 0);
		} else if (button.name === 'skip-next') {
			skipInput.value = skip + first;
		} else if (button.name === 'skip') {
			if (button.value < skipInput) {
				skipInput.value = Math.max(skip - first, 0);
			} else {
				skipInput.value = skip + first;
			}
		}

		form.submit();
	}
</script>

<Heading {heading} />

<section>
	<button class="add-partner" on:click={handleDialog}>Url toevoegen</button>
	<Search placeholderProp="Home"/>
</section>

{#if (totalUrls > first)}
<form method="GET" data-sveltekit-reload>
	<!-- <input type="hidden" name="skip" bind:this={skipInput} /> -->
	<button type="submit" name="skip" value={Math.max(skip - first, 0)} disabled={!hasPrevious}>← Prev</button>
	<Pages amount={totalUrls} perPage={first}/>
	<button type="submit" name="skip" value={skip + first} disabled={!hasNext}>Next →</button>
</form>
{/if}

{#if form?.success}
	<div class="toast"><p>{form?.message}</p></div>
{:else if form?.success == false}
	<div class="toast"><p>{form?.message}</p></div>
{/if}

<AddForm bind:this={dialogRef} isUrl={true} {params} />

<ul>
	{#each websites as website}
		<Partner {website} {overzicht} {params} {principes} isUrl={true} />
	{/each}
</ul>

<style>
	section {
		display: flex;
		justify-content: space-between;
		margin: 0 0 1em 1em;
	}

	form {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 1rem;
		margin-left: 1rem;
	}

	.add-partner, form button {
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

	.add-partner:hover, form button:hover {
		background-color: var(--c-pink);
	}

	form button:disabled {
		opacity: 0.5;
	}

	form button:hover:disabled {
		background-color: var(--c-modal-button);
		cursor: not-allowed;
	}

	ul {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(20em, 1fr));
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
