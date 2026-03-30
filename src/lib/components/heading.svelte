<script>

	let { heading, params, partners, websites, principes = null } = $props();


	const faviconAPI =
		'https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=';
</script>

<svelte:head>
	{#if heading.url}
		<title>Toolboard {heading.titel} {heading.url}</title>
		<meta
			name="description"
			content="Toolboard met overzicht van alle principes voor url: {heading.url}. Van partner: {heading.titel}."
		/>
	{:else if heading.homepage}
		<title>Urls van {heading.titel}</title>
		<meta name="description" content="Overzicht van alle urls van partner: {heading.titel}." />
	{:else}
		<title>Partneroverzicht</title>
		<meta name="description" content="Overzicht van alle Vervoerregio Amsterdam partners." />
	{/if}
</svelte:head>


<style>



</style>
