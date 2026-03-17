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
		gap: 1rem;
		align-items: center;
		background-color: var(--c-container);
		padding: clamp(1em, 6vw, 2em);
		border-top: 12px solid #b5006c;
		margin: 1em 1em;
		border-radius: 0.5em;
	}

	section img {
		box-shadow: 0px 0px 0px 8px #202020;
		border-radius: 0.3rem;
		background-color: #202020;
	}

	h1 {
		font-size: clamp(1.3rem, 4vw, 3.8rem);
	}
</style>
