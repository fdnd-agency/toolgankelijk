<script>
	import Checklist from '$lib/components/templates/checklist.svelte';
	import Sidebar from '$lib/components/templates/sidebar.svelte';
	import SubHeader from '$lib/components/templates/subheader.svelte';

	let { data, form } = $props();

	let heading = $derived({
		title: data.websitesData.website.title,
		homepage: data.urlData.url.url,
		url: data.urlData.url.slug
	});

	function handleApplyFilters(newFilters) {
		activeFilters = newFilters;
	}

	let toolboardData = $derived(data.toolboardData);
	let urlData = $derived(data.urlData);
	let guidelines = $derived(toolboardData.principle.guidelines);
	let principles = $derived(data.toolboardData.principles);
	let levels = $derived(data.levelsData.levels);
</script>

<section>
	{#if form?.success}
		<div class="toast"><p>Checklist is opgeslagen!</p></div>
	{/if}
	<Checklist {guidelines} {toolboardData} {levels} />
	<Sidebar {principles} {urlData} />
</section>

<style>
	section {
		display: flex;
		flex-wrap: wrap;
		margin: 1em;
		gap: 1em;
	}

	.toast {
		position: fixed;
		bottom: 5rem;
		right: 1rem;
		height: 4rem;
		width: 10rem;
		background-color: #22ff0025;
		backdrop-filter: blur(3px);
		border: 1px solid #22ff00;
		border-radius: 4px;
		padding: 0.5rem;
		text-shadow: 0px 0px 5px black;
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
