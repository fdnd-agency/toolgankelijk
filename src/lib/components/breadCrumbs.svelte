<script>
	import NavButton from "./NavButton.svelte";

	let { params, partners, websites, principes } = $props();

	let selectedPartner = $derived(
		params.websiteUID ? partners.websites.find(({ slug }) => slug === params.websiteUID) : ''
	);
	let selectedUrl = $derived(params.urlUID ? params.urlUID : '');
	let selectedPrincipe = $derived(
		params.principeUID ? principes.find(({ slug }) => slug === params.principeUID) : ''
	);

	const faviconAPI =
		'https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=';
</script>

<div class="bread-crumbs">
	<div class="dropdown">
		<NavButton size="large" aria="breadcrumb of {selectedPartner.homepage}">
			{#if selectedPartner}
				<span>
					<img
						width="24"
						src="{faviconAPI}{selectedPartner.homepage}/&size=128"
						alt="logo partner"
					/>{selectedPartner.titel}
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
						<a href="/{partner.slug}">
							<span>
								<img
									width="24"
									src="{faviconAPI}{partner.homepage}/&size=256"
									alt="logo partner"
								/>{partner.titel}
							</span>
						</a>
					</li>
				{/if}
			{/each}
		</ul>
	</div>

	{#if websites}
		<span class="seperator">/</span>
		<div class="dropdown">
		<NavButton size="large" aria="breadcrumb of {selectedUrl}">
				{#if selectedUrl}
					<span>{selectedUrl}</span>
				{:else}
					<span>Urls overzicht</span>
				{/if}
		</NavButton>
			<ul>
				<li>
					{#if selectedPartner}
						<a href="/{selectedPartner.slug}"><span>Urls overzicht</span></a>
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
</div>

<style>
	.bread-crumbs {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.dropdown {
		position: relative;
		display: inline-block;
		min-width: 12rem;
		height: max-content;
		z-index: 1;
	}

	.dropdown img {
		border-radius: 4px;
		height: 1.5rem;
		width: 1.5rem;
	}

	.seperator {
		font-size: 1.5rem;
		color: var(--c-white2);
	}

	ul {
		position: absolute;
		background-color: #2c2c2c;
		max-height: 0;
		width: 100%;
		border-radius: 0 0 0.5em 0.5em;
		overflow: hidden;
		transform: translateY(-100%);
		transition: 0.2s;
		z-index: -1;
	}

	ul li:nth-child(2) {
		border-top: 1px solid;
	}

	ul a {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: var(--c-white);
		background-color: var(--c-container);
		padding: 12px 16px;
		text-decoration: none;
	}

	ul:has(:global(a:focus)) {
		max-height: min-content;
		min-width: max-content;
		transform: translateY(0);
	}

	ul a:hover {
		background-color: var(--c-white);
		color: var(--c-text-header);
	}

	.dropdown:hover ul {
		max-height: min-content;
		min-width: max-content;
		transform: translateY(0);
	}

	.dropdown:hover button {
		background-color: var(--c-container);
		border-radius: 0.5em 0.5em 0 0;
	}

	button:has(:global(a:focus)) {
		background-color: var(--c-container);
		border-radius: 0.5em 0.5em 0 0;
	}

	.dropdown:hover button::after {
		transform: scale(-1, -1);
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
</style>
