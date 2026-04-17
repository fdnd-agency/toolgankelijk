<script>
	import NavButton from './NavButton.svelte';
	import { slide } from 'svelte/transition';

	let { 
        params, 
        partners = [], 
        websites = [], 
        principles = [], 
		overview
    } = $props();

	let activeDropdown = $state(null);

	let selectedPartner = $derived(
		params.websiteUID ? partners.websites.find(({ slug }) => slug === params.websiteUID) : ''
	);
	let selectedUrl = $derived(params.urlUID ? params.urlUID : '');

	let selectedPrinciple = $derived(
		params.principleUID ? principles.find(({ slug }) => slug === params.principleUID) : ''
	);

	function toggleDropdown(dropdownName) {
		activeDropdown = activeDropdown === dropdownName ? null : dropdownName;
	}

	const faviconAPI =
		'https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=';
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
				{#each partners.websites as partner}
					{#if partner}
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

	{#if selectedPartner && websites}
		<div class="breadcrumb-item">
			<NavButton
				onclick={() => toggleDropdown('url')}
				aria="breadcrumb of {selectedUrl}"
				showIcon={true}
				iconName="arrow"
				effect="dropdown"
			>
				{#if selectedUrl}
					<p>{selectedUrl}</p>
				{:else}
					<p>URL overzicht</p>
				{/if}
			</NavButton>

			{#if activeDropdown === 'url'}
				<ul class="dropdown-list" transition:slide={{ duration: 200 }}>
					{#each websites.urls as website}
						{#if selectedPartner && website && website.slug}
							<li>
								<NavButton href="/{selectedPartner.slug}/{website.slug}" effect="full">
									<p>{website.slug}</p>
								</NavButton>
							</li>
						{/if}
					{/each}
				</ul>
			{/if}
		</div>
	{/if}

	{#if selectedUrl && principles}
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
						{#if selectedPartner && selectedUrl && principle && principle.slug}
							<li>
								<NavButton
									href="/{selectedPartner.slug}/{selectedUrl}/{principle.slug}"
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
		left: 0;
		z-index: 10;

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
