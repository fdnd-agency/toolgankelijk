<script>
	// page with checks manually audit
	import Checklist from '$lib/components/templates/checklist.svelte';
	import Sidebar from '$lib/components/templates/sidebar.svelte';
	import SubHeader from '$lib/components/templates/subheader.svelte';

	let { data, form } = $props();
	let success = $derived(form?.success)

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
	<Checklist {guidelines} {toolboardData} {levels} {success} />
	<Sidebar {principles} {urlData} />
</section>

<style>
	section {
		display: flex;
		flex-wrap: wrap;
		margin: 1em;
		gap: 1em;
	}

</style>
