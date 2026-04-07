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
				<ul class="dropdown" class:open={isOpen}>
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
</div>

<!-- <div class="bread-crumbs">
	<div class="dropdown">
		<NavButton size="large" aria="breadcrumb of {selectedPartner}" width="full">
			{#if selectedPartner}
				<span>
					<img
						width="24"
						src="{faviconAPI}{selectedPartner.homepage}/&size=128"
						alt="logo partner"
					/>
					{selectedPartner.titel}
				</span>
			{:else}
				<p>Partners overzicht</p>
			{/if}
		</NavButton>
		<ul>
			<li>
				<a href="/"><span>Partners overzicht</span></a>
			</li>
			{#each partners.websites as partner}
				{#if partner}
					<li>
						<NavButton size="medium" variant="secondary" href="/{partner.slug}" width="full">
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
	</div>

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

	.dropdown {
		width: 15em;
		left: 0;
		position: relative;
		z-index: 1;
		transform: translateY(0);
		background-color: var(--color-primary-light);
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
		gap: 0.2em;
		flex-direction: column;
		transform: translateY(0);
		transition: 0.2s;
	}

	ul:has(:global(a:focus)) {
		max-height: min-content;
		min-width: max-content;
		transform: translateY(100%);
	}

	.breadcrumbs li:hover {
		background-color: var(--c-white);
		color: var(--c-text-header);
	}

	.breadcrumbs:hover ul {
		max-height: min-content;
		min-width: max-content;
		transform: translateY(0);
	}



	@media print {
		.bread-crumbs {
			display: none;
		}
	}

	@media only screen and (max-width: 990px) {
		.bread-crumbs {
			grid-row: 2;
			grid-column: span 2;
		}

		.bread-crumbs .dropdown {
			width: 100%;
			min-width: min-content;
		}
		.bread-crumbs .dropdown ul {
			width: 100%;
		}
	}

	@media only screen and (max-width: 560px) {
		.bread-crumbs {
			display: flex;
			flex-direction: column;
		}
		.seperator {
			display: none;
		}
		button {
			box-shadow: none;
		}
		ul {
			transition: 0s;
			position: relative;
		}
	}

	.dropdown.open {
        display: block;
    }
</style>
