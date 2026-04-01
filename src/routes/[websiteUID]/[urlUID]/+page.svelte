<script>
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import Heading from '$lib/components/heading.svelte';
    import Subheader from '$lib/components/subheader.svelte';

    let { data } = $props();

    let heading = $derived({
        titel: data.websitesData.website.titel,
        homepage: data.urlData.url.url,
        url: data.urlData.url.slug
    });

    let progressData = $state({});
    // every progress bar for the niveau of the principes
    const principes = data.principesData.principes;
    const niveaus = data.niveauData.niveaus;
    const checks = data.urlData.url.checks;

    let activeFilters = $state({
        principle: 'All',
        level: 'All',
        showNotMet: false,
        showMet: false
    });

    let filteredPrincipes = $derived(
        principes.filter((p) => {
            if (activeFilters.principle !== 'All' && p.titel !== activeFilters.principle) {
                return false;
            }

            const filteringVoldaan = activeFilters.showMet && !activeFilters.showNotMet;
            const filteringNietVoldaan = activeFilters.showNotMet && !activeFilters.showMet;

            if (filteringVoldaan || filteringNietVoldaan) {
                let total = 0;
                let behaald = 0;

                // Check progress against the currently active Niveau (or all of them if "All" is selected)
                const niveausToCheck =
                    activeFilters.level === 'All' ? niveaus.map((n) => n.niveau) : [activeFilters.level];

                niveausToCheck.forEach((niv) => {
                    // grab the math from progressData object
                    if (progressData[p.index] && progressData[p.index][niv]) {
                        total += progressData[p.index][niv].total;
                        behaald += progressData[p.index][niv].behaald;
                    }
                });

                // A principle is 'Voldaan' if it has required checks, and the achieved matches the total
                const isVoldaan = total > 0 && total === behaald;

                if (filteringVoldaan && !isVoldaan) return false; // Hide if we want Voldaan, but it isn't
                if (filteringNietVoldaan && isVoldaan) return false; // Hide if we want Niet Voldaan, but it is
            }

            return true;
        })
    );
    let filteredNiveaus = $derived(
        niveaus.filter((n) => {
            if (activeFilters.level === 'All') {
                return true;
            }
            return n.niveau === activeFilters.level;
        })
    );

    function handleApplyFilters(newFilters) {
        activeFilters = newFilters;
    }

    principes.forEach((principe) => {
        const pIndex = principe.index;
        progressData[pIndex] = {};

        niveaus.forEach((niveau) => {
            const niveauName = niveau.niveau;
            const totalChecks = principe.richtlijnen
                .flatMap((check) => check.succescriteria)
                .filter((criteria) => criteria.niveau === niveauName);

            const successChecks = checks
                .flatMap((check) => check.succescriteria)
                .filter(
                    (criteria) => criteria.niveau === niveauName && criteria.index.startsWith(pIndex + '.')
                );

            progressData[pIndex][niveauName] = {
                total: totalChecks.length,
                behaald: successChecks.length
            };
        });
    });
</script>

<Heading {heading} />

<Subheader partnerTitle={data.websitesData.website.titel} onApply={handleApplyFilters} />

<section class="container-principes">
    <ul>
        {#each filteredPrincipes as principe (principe.index)}
            <li>
                <a href="{$page.url.pathname}/{principe.slug}">
                    <div class="principe">
                        <h1>
                            <span>{principe.titel}.</span> Principe {principe.index}
                        </h1>
                        <p>{principe.beschrijving.text}</p>

                        {#each filteredNiveaus as n}
                            <p>{n.niveau}</p>
                            <div class="progress-container">
                                <progress
                                    name="progress-partner-{n.niveau}"
                                    id="progress-partner"
                                    max={progressData[principe.index][n.niveau].total || 1}
                                    value={progressData[principe.index][n.niveau].behaald || 0}
                                ></progress>
                                <label class="progress-percentage" for="progress-partner-{n.niveau}">
                                    {progressData[principe.index]?.[n.niveau]
                                        ? progressData[principe.index][n.niveau].total
                                            ? Math.round(
                                                  (progressData[principe.index][n.niveau].behaald /
                                                      progressData[principe.index][n.niveau].total) *
                                                      100
                                              )
                                            : 0
                                        : 0}%
                                </label>
                            </div>
                        {/each}
                    </div>
                </a>
            </li>
        {/each}
    </ul>
</section>

<style>
    :global(*) {
        box-sizing: border-box;
    }

    li a {
        text-decoration: none;
        color: inherit;
    }

    h1 {
        font-size: 1.5em;
        margin-bottom: 0.25em;
    }

    .container-principes ul {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1em;

        list-style-type: none;
        margin: 0 1em;
        margin-bottom: 1em;
    }

    .container-principes li {
        border-radius: 0.5em;
        border: solid 1px transparent;
    }

    .container-principes li:hover {
        border: solid 1px var(--c-orange);
    }

    span {
        color: var(--c-orange);
    }

    .principe p {
        font-size: 1em;
        margin-bottom: 3rem;
        width: 80%;
    }

    .principe {
        padding: 2em;
        background-color: var(--c-container);

        border-radius: 0.5em;
        height: 100%;
        border: solid 1px var(--c-container-stroke);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .progress-container {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: flex-end;
        gap: 1em;
        margin-top: 0.25em;
    }

    progress {
        width: 100%;
    }

    progress[value] {
        -webkit-appearance: none;
        appearance: none;
        height: 60%;
    }

    progress[value]::-webkit-progress-bar {
        background-color: var(--c-container-stroke);
        border-radius: 0.5em;
    }

    progress[value]::-webkit-progress-value {
        background-color: var(--c-orange);
        border-radius: 0.5em;
    }

    .progress-percentage {
        height: 85%;
    }
</style>