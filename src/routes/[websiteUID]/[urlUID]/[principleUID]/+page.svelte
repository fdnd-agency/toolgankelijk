<script>
	// page with checks manually audit
	import Checklist from '$lib/components/templates/checklist.svelte';
	import Sidebar from '$lib/components/templates/sidebar.svelte';

	let { data, form } = $props();

	let success = $derived(form?.success);
	
	let heading = $derived({
		title: data.websitesData.website.title,
		homepage: data.urlData.url.url,
		url: data.urlData.url.slug
	});

	let toolboardData = $derived(data.toolboardData);
	let urlData = $derived(data.urlData);
	let guidelines = $derived(toolboardData.principle.guidelines);
	let principles = $derived(data.toolboardData.principles);

	// the chosen filters come from the url via the load function (?beschrijving=...&niveau=...)
	const filterValue = (name) => data.filters.find((filter) => filter.name === name)?.value;

	let selectedLevel = $derived(filterValue('niveau'));
	let description = $derived(filterValue('beschrijving'));
</script>

<section>
	<Checklist {guidelines} {toolboardData} {selectedLevel} {description} {success}/>
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