<script>
	// mixture of breadcrumb and dropdown, shows all the variables of partner, url and principles
	import NavButton from '../molecules/navButton.svelte';
	// the slide function is a svelte best practise when you open the dropdown
	import { slide } from 'svelte/transition';

	let { 
		params = {}, 
		partners = [], 
		websites = [], 
		principles = [], 
		overview }
	= $props();

	let activeDropdown = $state(null);
	let partnerList = $derived(Array.isArray(partners) ? partners : partners?.websites || []);

	// when a partner is selected it shows the partner
	let selectedPartner = $derived(
		params.websiteUID ? partnerList.find(({ slug }) => slug === params.websiteUID) : null
	);

	let selectedUrl = $derived(params.urlUID ? params.urlUID : '');

	let selectedUrlItem = $derived(
		params?.urlUID ? (websites || []).find(({ slug }) => slug === params.urlUID) : null
	);

	let urlList = $derived((websites || []).filter((w) => w?.name));

	let selectedPrinciple = $derived(
		params.principleUID ? principles.find(({ slug }) => slug === params.principleUID) : null
	);

	// function to open up the dropdown
	function toggleDropdown(dropdownName) {
		activeDropdown = activeDropdown === dropdownName ? null : dropdownName;
	}

	// the favicon is shown in the dropdown list
	const faviconAPI =
		'https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=';

	$effect(() => {
		if (params) {
			activeDropdown = null;
		}
	});
</script>

<div class="breadcrumbs">
	<div class="breadcrumb-item">
		<NavButton
			onclick={() => toggleDropdown('partner')}
			aria="breadcrumb of {selectedPartner}"
			effect="dropdown"
			showIcon={true}
			iconName="arrow"
		>
		<!-- if there is a selected partner show that if not show partner overzicht -->
			{#if selectedPartner}
				<p>{selectedPartner.title}</p>
			{:else}
				<p>Partners overzicht</p>
			{/if}
		</NavButton>

		{#if activeDropdown === 'partner'}
			<ul
				id="dropdown-list-wrapper"
				class="color-primary-light"
				transition:slide={{ duration: 200 }}
			>
				<div class="dropdown-controls">
					<NavButton
						onclick={() => toggleDropdown('partner')}
						aria="breadcrumb of {selectedPartner}"
						effect="dropdown-wrap"
					>
						{#if selectedPartner}
							<p>{selectedPartner.title}</p>
						{:else}
							<p>Partners overzicht</p>
						{/if}
					</NavButton>

					<NavButton
						variant="primary"
						size="small"
						showIcon={true}
						iconName="cross"
						effect="cross"
						onclick={() => toggleDropdown()}
					></NavButton>
				</div>
				<div class="dropdown-list">
					{#each partnerList as partner}
						{#if partner && partner.slug}
							<li>
								<NavButton variant="primary" href="/{partner.slug}" effect="select">
									<p>{partner.title}</p>
								</NavButton>
							</li>
						{/if}
					{/each}
				</div>
			</ul>
		{/if}
	</div>

	{#if selectedPartner && websites.length > 0}
		<div class="breadcrumb-item">
			<NavButton
				onclick={() => toggleDropdown('url')}
				aria="breadcrumb of {selectedUrl}"
				effect="dropdown"
				showIcon={true}
				iconName="arrow"
			>
				{#if selectedUrlItem}
					<p>{selectedUrlItem.name || selectedUrlItem.title}</p>
				{:else}
					<p>URL overzicht</p>
				{/if}
			</NavButton>

			{#if activeDropdown === 'url'}
				<ul
					id="dropdown-list-wrapper"
					class="color-primary-light"
					transition:slide={{ duration: 200 }}
				>
					<div class="dropdown-controls">
						<NavButton size="medium" effect="dropdown-wrap">URL dropdown</NavButton>
						<NavButton
							variant="primary"
							size="small"
							showIcon={true}
							iconName="cross"
							effect="cross"
							onclick={() => toggleDropdown()}
						></NavButton>
					</div>
					<div class="dropdown-list">
						{#each urlList as urlItem}
							{#if selectedPartner && urlItem && urlItem.slug}
								<li>
									<NavButton href="/{selectedPartner.slug}/{urlItem.slug}" effect="select">
										<p title={urlItem.name}>{urlItem.name}</p>
									</NavButton>
								</li>
							{/if}
						{/each}
					</div>
				</ul>
			{/if}
		</div>
	{/if}

	{#if selectedUrlItem && principles.length > 0}
		<div class="breadcrumb-item">
			<NavButton
				onclick={() => toggleDropdown('principle')}
				variant="primary"
				effect="dropdown"
				showIcon={true}
				iconName="arrow"
				aria="Principe Overzicht"
			>
				{#if selectedPrinciple}
					<span>{selectedPrinciple.title}</span>
				{:else}
					<span>Principles overzicht</span>
				{/if}
			</NavButton>

			{#if activeDropdown === 'principle'}
				<ul
					id="dropdown-list-wrapper"
					class="color-primary-light"
					transition:slide={{ duration: 200 }}
				>
					<div class="dropdown-controls">
						<NavButton effect="dropdown" aria="Principes">Principes</NavButton>
						<NavButton
							variant="primary"
							size="small"
							showIcon={true}
							iconName="cross"
							effect="cross"
							aria="sluiten"
							onclick={() => toggleDropdown()}
						></NavButton>
					</div>

					<div class="dropdown-list">
						{#each principles as principle}
							{#if selectedPartner && selectedUrlItem && principle && principle.slug}
								<li>
									<NavButton
										href="/{selectedPartner.slug}/{selectedUrlItem.slug}/{principle.slug}"
										effect="select"
										aria={principle.title}
									>
										<p>{principle.title}</p>
									</NavButton>
								</li>
							{/if}
						{/each}
					</div>
				</ul>
			{/if}
		</div>
	{/if}
</div>

<style>
	.breadcrumbs {
		display: flex;
		flex-direction: row;
		gap: 0.5rem;
		width: 100%;

		@media (max-width: 1080px) {
			display: flex;
			flex-direction: column;
			width: 100%;
		}
	}

	#dropdown-list-wrapper {
		position: absolute;
		top: calc(100% + 0.1em);
		z-index: 10;
		box-sizing: border-box;
		width: 16em;
		background-color: var(--color-primary-light);
		border: var(--color-primary) solid 3px;
		border-radius: var(--border-radius);
		padding: 1em;

		@media (max-width: 1320px) {
			width: 12em;
		}

		@media (max-width: 1080px) {
			width: 100%;
		}

		&:target {
			display: block;
		}
	}

	.dropdown-list {
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 0.3em;
		margin: 0;
		background-color: var(--dark-2);
		padding-top: 1em;
		padding-bottom: 1em;
		padding-left: 0.5em;
		padding-right: 0.5em;
		border-radius: var(--border-radius);
		max-height: 12em;
		overflow-y: auto;

		li {
			width: 100%;
			height: 100%;
			-webkit-overflow-scrolling: touch;
			scroll-snap-align: start;
			flex-shrink: 0;
		}

		li:hover p {
			white-space: normal;
			word-break: normal;
			overflow: visible;
		}

		@media (max-width: 720px) {
			width: 100%;
		}
	}

	.dropdown-list:target {
		display: block;
	}

	.dropdown-controls {
		display: flex;
		padding-bottom: 0.5em;
		gap: 0.5em;

		@media (max-width: 1320px) {
			gap: 0.2em;
		}
	}

	.breadcrumb-item {
		position: relative;
	}

	@media print {
		.breadcrumbs {
			display: none;
		}
	}
</style>
