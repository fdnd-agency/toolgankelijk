<script>
	import NavButton from './NavButton.svelte';

	let isOpen = $state(false);
	let { params, partners, websites, principes } = $props();
	let selectedPartner = $derived(
		params.websiteUID ? partners.websites.find(({ slug }) => slug === params.websiteUID) : ''
	);
	let selectedUrl = $derived(params.urlUID ? params.urlUID : '');
	let selectedPrincipe = $derived(
		params.principeUID ? principes.find(({ slug }) => slug === params.principeUID) : ''
	);

function toggleDropdown() {
        isOpen = !isOpen;
    }

	const faviconAPI =
		'https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=';
</script>

<div class="breadcrumbs">

		<NavButton onclick={toggleDropdown} size="large" aria="breadcrumb of {selectedPartner}" showIcon={true} iconName="arrow" effect="reverse">
				{#if selectedPartner}
					<img width="24" src="{faviconAPI}{selectedPartner.homepage}/&size=128" alt="logo partner" />
					<p> {selectedPartner.titel} </p>
				{:else}
					<p>Partners overzicht</p>
				{/if}

		</NavButton>

		<ul class="dropdown-url" class:open={isOpen}>
				{#each partners.websites as partner}
					{#if partner}
						<li>
							<NavButton variant="primary" href="/{partner.slug}" effect="select">
									<img
										width="24"
										src="{faviconAPI}{partner.homepage}/&size=256"
										alt="logo partner"/>
									<p>
										{partner.titel}
									</p>
							</NavButton>
						</li>
					{/if}
				{/each}
		</ul>

		<NavButton onclick={toggleDropdown} size="large" aria="breadcrumb of {selectedPartner}" showIcon={true} iconName="arrow" effect="reverse">
				{#if selectedPartner}
					<img width="24" src="{faviconAPI}{selectedPartner.homepage}/&size=128" alt="logo partner" />
					<p> {selectedPartner.titel} </p>
				{:else}
					<p>Partners overzicht</p>
				{/if}
		</NavButton>

		<ul class="dropdown-partners">
				{#each websites.urls as website}
					{#if selectedPartner && website && website.slug}
						<li>
							<NavButton href="/{selectedPartner.slug}/{website.slug}" effect="reverse">
								<p>
									{website.slug}
								</p>
							</NavButton>
						</li>
					{/if}
				{/each}
			</ul>
</div>

<!-- <div class="bread-crumbs">
	{#if websites}
		<span class="seperator">/</span>
		<div class="dropdown">
			<NavButton size="large" aria="breadcrumb of {selectedUrl}" width="full">
				{#if selectedUrl}
					<p>{selectedUrl}</p>
				{:else}
					<p>Urls overzicht</p>
				{/if}
			</NavButton>
			<ul>
				<li>
					{#if selectedPartner}
					<NavButton size="large" aria="breadcrumb of {selectedPartner.slug}" width="full">
						<p>URLs overzicht</p>
					</NavButton>
					{:else}
						<span>Urls overzicht</span>
					{/if}
				</li>
				{#each websites.urls as website}
					{#if selectedPartner && website && website.slug}
						<li>
							<a href="/{selectedPartner.slug}/{website.slug}"><span>{website.slug}</span></a>
						</li>
					{/if}
				{/each}
			</ul>
		</div>
	{/if}

	{#if selectedUrl && principes}
		<span class="seperator">/</span>
		<div class="dropdown">
			<NavButton size="medium" variant="secondary">
				{#if selectedPrincipe}
					<span>{selectedPrincipe.titel}</span>
				{:else}
					<span>Principes overzicht</span>
				{/if}
			</NavButton>
			<ul>
				<li>
					{#if selectedPartner}
						<a href="/{selectedPartner.slug}/{selectedUrl}"><span>Principes overzicht</span></a>
					{:else}
						<span>Principes overzicht</span>
					{/if}
				</li>
				{#each principes as principe}
					{#if selectedPartner && selectedUrl && principe && principe.slug}
						<li>
							<a href="/{selectedPartner.slug}/{selectedUrl}/{principe.slug}">
								<span>{principe.titel}</span>
							</a>
						</li>
					{/if}
				{/each}
			</ul>
		</div>
	{/if}
</div> -->

<style>
	.breadcrumbs {
		gap: 0.5rem;
	}

	.dropdown-url {
		width: 15em;
		left: 0;
		position: relative;
		z-index: 1;
		transform: translateY(-100%);
		background-color: var(--color-primary-light);
		transition-duration: 0.2s;
		border: var(--color-primary) solid 3px;
		border-radius: var(--border-radius);
		padding: 1em;
		overflow: hidden;
		display: none;
	}

	ul {
		list-style: none;
		overflow: hidden;
		display: flex;
		transition: 0.2s;
	}


	/* make application available for printing */
	@media print {
		.bread-crumbs {
			display: none;
		}
	}

	.open {
        display: flex;
		flex-direction: column;
		gap: 0.3em;
		transform: translateY(0);
		transition-duration: 0.2s;
    }
</style>
