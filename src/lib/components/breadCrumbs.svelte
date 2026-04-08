<script>
	import NavButton from './NavButton.svelte';
	import { slide } from 'svelte/transition';

	let { params, partners, websites, principes, urls } = $props();

	let activeDropdown = $state(null);

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
	<div class="breadcrumb-item">
    <NavButton onclick={() => toggleDropdown('partner')} size="large" aria="breadcrumb of {selectedPartner}" showIcon={true} iconName="arrow" effect="reverse">
        {#if selectedPartner}
            <img width="24" src="{faviconAPI}{selectedPartner.homepage}/&size=128" alt="logo partner" />
            <p>{selectedPartner.titel}</p>
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
                            <img width="24" src="{faviconAPI}{partner.homepage}/&size=256" alt="logo partner"/>
                            <p>{partner.titel}</p>
                        </NavButton>
                    </li>
                {/if}
            {/each}
        </ul>
    {/if}
	</div>

    {#if websites}
	<div class="breadcrumb-item">
        <NavButton onclick={() => toggleDropdown('url')} size="large" aria="breadcrumb of {selectedUrl}" showIcon={true} iconName="arrow" effect="reverse">
            {#if selectedUrl} <p>{selectedUrl}</p>
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


    {#if selectedUrl && principes}
		<div class="breadcrumb-item">
        <NavButton onclick={() => toggleDropdown('principe')} size="medium" variant="primary" effect="reverse">
            {#if selectedPrincipe}
                <span>{selectedPrincipe.titel}</span>
            {:else}
                <span>Principes overzicht</span>
            {/if}
        </NavButton>

        {#if activeDropdown === 'principe'}
            <ul class="dropdown-list" transition:slide={{ duration: 200 }}>
                {#each principes as principe}
                    {#if selectedPartner && selectedUrl && principe && principe.slug}
                        <li>
						<NavButton href="/{selectedPartner.slug}/{selectedUrl}/{principe.slug}" effect="full"> 
                                <p>{principe.titel}</p>
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
    }

	.breadcrumb-item {
        position: relative; 
    }


	/* make application available for printing */
	@media print {
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
