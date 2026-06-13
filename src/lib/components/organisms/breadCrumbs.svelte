<script>
    import NavButton from '../molecules/navButton.svelte';
    import { slide } from 'svelte/transition';

    let { params = {}, partners = [], websites = [], principles = [], overview } = $props();

    let activeDropdown = $state(null);
    let partnerList = $derived(Array.isArray(partners) ? partners : partners?.websites || []);

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

    function toggleDropdown(dropdownName) {
        activeDropdown = activeDropdown === dropdownName ? null : dropdownName;
    }
    const faviconAPI =
        'https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=';

    $effect(() => {
        if (params) {
            activeDropdown = null;
        }
    });
</script>

<div class="breadcrumbs">
    <div class="breadcrumb-item" class:open={activeDropdown === 'partner'}>
        <NavButton
            onclick={() => toggleDropdown('partner')}
            aria="breadcrumb of {selectedPartner}"
            effect="dropdown"
            showIcon={true}
            iconName="arrow"
            active={activeDropdown === 'partner' ? 'active' : ''}
        >
            {#if selectedPartner}
                <span class="trigger-text">{selectedPartner.title}</span>
            {:else}
                <span class="trigger-text">Partners overzicht</span>
            {/if}
        </NavButton>

        {#if activeDropdown === 'partner'}
            <div
                class="dropdown-list-wrapper"
                transition:slide={{ duration: 200 }}
            >
                <ul class="dropdown-list">
                    {#each partnerList as partner}
                        {#if partner && partner.slug}
                            <li>
                                <NavButton href="/{partner.slug}" effect="select">
                                    <div class="item-content partner-item">
                                        <span class="item-text">{partner.title}</span>
                                    </div>
                                </NavButton>
                            </li>
                        {/if}
                    {/each}
                </ul>
            </div>
        {/if}
    </div>

    {#if selectedPartner && websites.length > 0}
        <div class="breadcrumb-item" class:open={activeDropdown === 'url'}>
            <NavButton
                onclick={() => toggleDropdown('url')}
                aria="breadcrumb of {selectedUrl}"
                effect="dropdown"
                showIcon={true}
                iconName="arrow"
                active={activeDropdown === 'url' ? 'active' : ''}
            >
                {#if selectedUrlItem}
                    <span class="trigger-text">{selectedUrlItem.name || selectedUrlItem.title}</span>
                {:else}
                    <span class="trigger-text">URL overzicht</span>
                {/if}
            </NavButton>

            {#if activeDropdown === 'url'}
                <div
                    class="dropdown-list-wrapper"
                    transition:slide={{ duration: 200 }}
                >
                    <ul class="dropdown-list">
                        {#each urlList as urlItem}
                            {#if selectedPartner && urlItem && urlItem.slug}
                                <li>
                                    <NavButton href="/{selectedPartner.slug}/{urlItem.slug}" effect="select">
                                        <div class="item-content center-item">
                                            <span class="item-text" title={urlItem.name}>{urlItem.name}</span>
                                        </div>
                                    </NavButton>
                                </li>
                            {/if}
                        {/each}
                    </ul>
                </div>
            {/if}
        </div>
    {/if}

    {#if selectedUrlItem && principles.length > 0}
        <div class="breadcrumb-item" class:open={activeDropdown === 'principle'}>
            <NavButton
                onclick={() => toggleDropdown('principle')}
                effect="dropdown"
                showIcon={true}
                iconName="arrow"
                aria="Principe Overzicht"
                active={activeDropdown === 'principle' ? 'active' : ''}
            >
                {#if selectedPrinciple}
                    <span class="trigger-text">{selectedPrinciple.title}</span>
                {:else}
                    <span class="trigger-text">Principles</span>
                {/if}
            </NavButton>

            {#if activeDropdown === 'principle'}
                <div
                    class="dropdown-list-wrapper"
                    transition:slide={{ duration: 200 }}
                >
                    <ul class="dropdown-list">
                        {#each principles as principle}
                            {#if selectedPartner && selectedUrlItem && principle && principle.slug}
                                <li>
                                    <NavButton
                                        href="/{selectedPartner.slug}/{selectedUrlItem.slug}/{principle.slug}"
                                        effect="select"
                                        aria={principle.title}
                                    >
                                        <div class="item-content center-item">
                                            <span class="item-text">{principle.title}</span>
                                        </div>
                                    </NavButton>
                                </li>
                            {/if}
                        {/each}
                    </ul>
                </div>
            {/if}
        </div>
    {/if}
</div>

<style>
    .breadcrumbs {
        display: flex;
        flex-direction: row;
        gap: 1em;
        width: auto;

        @media (max-width: 1080px) {
            flex-direction: column;
            width: 100%;
        }
    }

    .breadcrumb-item {
        position: relative;
        display: flex;
        flex-direction: column;
        width: 16em;

        @media (max-width: 1320px) {
            width: 14em;
        }

        @media (max-width: 1080px) {
            width: 100%;
        }
    }

    .breadcrumb-item :global(.navbutton.dropdown) {
        width: 100%;
        background-color: var(--color-primary-light, #f8d7e8);
        color: var(--color-neutral-black);
        border: 2px solid transparent;
        border-radius: var(--border-radius);
        position: relative;
        z-index: 11;
        justify-content: space-between;
    }

    .breadcrumb-item.open :global(.navbutton.dropdown) {
        border-radius: 12px 12px 0 0;
        background-color: var(--color-primary-light, #f8d7e8);
    }

    .trigger-text {
        flex-grow: 1;
        text-align: center;
    }

    /* Dropdown List Wrapper styling */
    .dropdown-list-wrapper {
        position: absolute;
        top: 100%; /* Connects directly below the trigger button */
        left: 0;
        z-index: 10;
        box-sizing: border-box;
        width: 100%;
        background-color: var(--color-primary, #b30059);
        padding: 0.5em;
        border-radius: 0 0 12px 12px;
    }

    .dropdown-list {
        list-style: none;
        display: flex;
        flex-direction: column;
        gap: 0.4em;
        margin: 0;
        padding: 0;
        max-height: 20em;
        overflow-y: auto;
    }

    .dropdown-list li {
        width: 100%;
        display: block;
    }

    .dropdown-list :global(.navbutton.select) {
        background-color: var(--color-primary-light);
        color: var(--color-neutral-black);
        border: none;
        border-radius: 6px;
        height: 3.2em;
        width: 100%;
        padding: 0;
        display: flex;
        align-items: center;
        text-decoration: none;
    }

    .dropdown-list :global(.navbutton.select:hover) {
        filter: brightness(0.95);
        transform: scale(0.99);
    }

    .item-content {
        display: flex;
        align-items: center;
        width: 100%;
        height: 100%;
        padding: 0 0.8em;
        box-sizing: border-box;
    }

    .partner-item {
        justify-content: flex-start;
    }

    .center-item {
        justify-content: center;
    }


    .item-text {
        font-weight: bold;
    }


    .partner-item .item-text {
        flex-grow: 1;
        text-align: center;
        padding-right: 3em; 
    }

    @media print {
        .breadcrumbs {
            display: none;
        }
    }
</style>