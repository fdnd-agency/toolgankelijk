<script>
	import NavButton from '../molecules/navButton.svelte';
	import { slide } from 'svelte/transition';

	let { 
        params = {}, 
        partners = [], 
        websites = [], 
        principles = [], 
		overview
    } = $props();

	let activeDropdown = $state(null);
	let partnerList = $derived(Array.isArray(partners) ? partners : (partners?.websites || []));

	let selectedPartner = $derived(
        params.websiteUID ? partnerList.find(({ slug }) => slug === params.websiteUID) : null
    );

	let selectedUrl = $derived(params.urlUID ? params.urlUID : '');

	let selectedUrlItem = $derived(
		params?.urlUID ? (websites || []).find(({ slug }) => slug === params.urlUID) : null
	);

	let urlList = $derived(
		(websites || []).filter(w => w?.name) 
	);

	let selectedPrinciple = $derived(
        params.principleUID ? principles.find(({ slug }) => slug === params.principleUID) : null
    );

	function toggleDropdown(dropdownName) {
		activeDropdown = activeDropdown === dropdownName ? null : dropdownName;
	}
	const faviconAPI =
		'https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=';

	$effect(() => {
		if (params) {
			activeDropdown = null;
		}
	})
</script>

<div class="breadcrumbs">
	<div class="breadcrumb-item">
		<NavButton
			onclick={() => toggleDropdown('partner')}
			aria="breadcrumb of {selectedPartner}"
			showIcon={true}
			iconName="arrow"
			effect="dropdown"
		>
			{#if selectedPartner}
				<img width="24" src="{faviconAPI}{selectedPartner.homepage}/&size=128" alt="logo partner" />
				<p>{selectedPartner.title}</p>
			{:else}
				<p>Partners overzicht</p>
			{/if}
		</NavButton>

		{#if activeDropdown === 'partner'}
			<ul class="dropdown-list" transition:slide={{ duration: 200 }}>
				{#each partnerList as partner}
					{#if partner && partner.slug}
						<li>
							<NavButton variant="primary" href="/{partner.slug}" effect="select">
								<img width="24" src="{faviconAPI}{partner.homepage}/&size=256" alt="logo partner" />
								<p>{partner.title}</p>
							</NavButton>
						</li>
					{/if}
				{/each}
			</ul>
		{/if}
	</div>

	{#if selectedPartner && websites.length > 0}
		<div class="breadcrumb-item">
			<NavButton
				onclick={() => toggleDropdown('url')}
				aria="breadcrumb of {selectedUrl}"
				showIcon={true}
				iconName="arrow"
				effect="dropdown"
			>
				{#if selectedUrlItem}
                    <p>{selectedUrlItem.name || selectedUrlItem.title}</p>
                {:else}
                    <p>URL overzicht</p>
                {/if}
			</NavButton>

			{#if activeDropdown === 'url'}
				<ul class="dropdown-list" transition:slide={{ duration: 200 }}>
					{#each urlList as urlItem}
						{#if selectedPartner && urlItem && urlItem.slug}
							<li>
								<NavButton href="/{selectedPartner.slug}/{urlItem.slug}" effect="full">
									<p title={urlItem.name}>{urlItem.name}</p>
								</NavButton>
							</li>
						{/if}
					{/each}
				</ul>
			{/if}
		</div>
	{/if}

	{#if selectedUrlItem && principles.length > 0}
		<div class="breadcrumb-item">
			<NavButton onclick={() => toggleDropdown('principle')} variant="primary" effect="dropdown">
				{#if selectedPrinciple}
					<span>{selectedPrinciple.title}</span>
				{:else}
					<span>Principles overzicht</span>
				{/if}
			</NavButton>

			{#if activeDropdown === 'principle'}
				<ul class="dropdown-list" transition:slide={{ duration: 200 }}>
					{#each principles as principle}
						{#if selectedPartner && selectedUrlItem && principle && principle.slug}
							<li>
								<NavButton
									href="/{selectedPartner.slug}/{selectedUrlItem.slug}/{principle.slug}"
									effect="full"
								>
									<p>{principle.title}</p>
								</NavButton>
							</li>
						{/if}
					{/each}
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
		width: 50%;

		@media (max-width: 720px) {
			display: flex;
			flex-direction: column;
			width: 100%;
		}
	}

	.dropdown-list {
		position: absolute;
		top: calc(100% + 0.5rem);
		z-index: 10;
		box-sizing: border-box;
		width: 15em;
		background-color: var(--color-primary-light);
		border: var(--color-primary) solid 3px;
		border-radius: var(--border-radius);
		padding: 1em;
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 0.3em;
		margin: 0;

		max-height: 18.2em;
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

	.breadcrumb-item {
		position: relative;
	}

	@media print {
		.breadcrumbs {
			display: none;
		}
	}
</style>