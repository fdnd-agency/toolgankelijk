<script>
	let { heading } = $props();

	const faviconAPI =
		'https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=';
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

<section>
	{#if heading.homepage}
		<img width="60" src="{faviconAPI}{heading.homepage}/&size=128" alt="logo partner" />
	{/if}
	<h1>
		{heading.title}{#if heading.url}/{heading.url}{/if}
	</h1>
</section>

<style>
	section {
		display: flex;
		gap: 1em;
		padding: 1em;
	}
</style>
