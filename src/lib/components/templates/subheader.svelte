<script>
    import { page } from '$app/stores';
    import NavButton from '$lib/components/molecules/navButton.svelte';
    import BreadCrumbs from '$lib/components/organisms/breadCrumbs.svelte';
    import Heading from '$lib/components/molecules/heading.svelte';
    import Search from '$lib/components/molecules/search.svelte';

    let {
        params,
        user,
        partners = [],
        websites = [],
        principles = [],
        overview,
        showAdd = false,
        onAdd,
        onApply,
        heading
    } = $props();

    let principle = $state('All');
    let level = $state('All');
    let showNotMet = $state(false);
    let showMet = $state(false);

    function handleSubmit(e) {
        if (e) e.preventDefault();

        if (onApply) {
            onApply({
                principle,
                level,
                showNotMet,
                showMet
            });
        }
    }
</script>

<div class="subheader">
    <!-- Top Row: Heading and Search/Add Actions -->
    <div class="subheader-row top-row">
        <div class="subheader-heading">
            <Heading {heading} />
        </div>

        <div class="subheader-actions">
            <NavButton 
                size="small" 
                variant="primary" 
                showIcon={true} 
                iconName="add" 
                effect="add"
                onclick={onAdd}
                aria="Add Partner"
            />
            
            <div class="search-wrapper">
                <input class="search-tool-subheader" type="text" placeholder="Search..."> 
                <!-- If you are using the <Search /> component instead, place it here -->
            </div>
        </div>
    </div>

    <!-- Bottom Row: Breadcrumbs and Sorting -->
    <div class="subheader-row bottom-row">
        <div class="subheader-breadcrumbs">
            {#if user && user.isEmailVerified}
                <BreadCrumbs {params} {partners} {websites} {overview} {principles} />
            {/if}
        </div>

        <div class="subheader-filters">
            <p class="filter-label">Sorteren op:</p>
            <NavButton effect="dropdown" size="medium" showIcon={true} iconName="arrow">Levels</NavButton>
            <NavButton effect="dropdown" size="medium" showIcon={true} iconName="arrow">Principles</NavButton>
        </div>
    </div>
</div>

<style>
    .subheader {
        display: flex;
        flex-direction: column;
        gap: 1.5em;
        width: 90%;
        margin-top: 1em;
        margin-bottom: 2em;
		margin-left: 5%;
		margin-right: 5%;
    }

    .subheader-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        gap: 1em;
    }

    .subheader-heading {
        display: flex;
        align-items: center;
        flex-shrink: 0;
    }

    .subheader-actions {
        display: flex;
        gap: 1em;
        align-items: center;
    }

    .subheader-breadcrumbs {
        display: flex;
        align-items: center;
        flex-grow: 1;
    }

    .subheader-filters {
        display: flex;
        gap: 1em;
        align-items: center;
    }

    .filter-label {
        font-size: 0.9em;
        margin: 0;
        color: var(--color-neutral-black, #000);
        white-space: nowrap;
    }

    .search-wrapper {
        display: flex;
        align-items: center;
    }

    .search-tool-subheader {
        height: 3em;
        border-radius: 1.5em; /* Creates the pill-shape from the design */
        border: 2px solid var(--color-neutral-black, #000);
        padding: 0 1em;
        font-size: 1em;
        min-width: 200px;
        outline: none;
        transition: border-color 0.2s ease;
    }

    .search-tool-subheader:focus {
        border-color: var(--color-primary, #b30059);
    }

    /* Mobile Responsiveness */
    @media (max-width: 1080px) {
        .subheader {
            gap: 1em;
        }

        .subheader-filters {
            display: none; /* Keep sorting hidden on smaller screens as in original code */
        }
    }

    @media (max-width: 720px) {
        .subheader-row {
            flex-direction: column;
            align-items: flex-start;
        }
        
        .subheader-actions {
            width: 100%;
            justify-content: space-between;
        }
    }
</style>