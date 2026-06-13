<script>
	let { heading } = $props();
</script>

<svelte:head>
	{#if heading.url}
		<title>Toolboard {heading.title} {heading.url}</title>
		<meta
			name="description"
			content="Toolboard met overzicht van alle principes voor url: {heading.url}. Van partner: {heading.title}."
		/>
	{:else if heading.homepage}
		<title>Urls van {heading.title}</title>
		<meta name="description" content="Overzicht van alle urls van partner: {heading.title}." />
	{:else}
		<title>Partneroverzicht</title>
		<meta name="description" content="Overzicht van alle Vervoerregio Amsterdam partners." />
	{/if}
</svelte:head>

<h1>
	{heading.title || "Partner Overzicht"}{#if heading.url}/{heading.url}{/if}
</h1>
