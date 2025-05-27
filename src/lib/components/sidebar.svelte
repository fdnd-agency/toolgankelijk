<script>
    export let principes;
    export let urlData;

    let baseUrl = `/${urlData.url.website.slug}/${urlData.url.slug}`;

    // Get the niveaus for each principe
    function getNiveausForPrincipe(principe) {
        const niveaus = new Set();
        principe.richtlijnen.forEach(richtlijn =>
            richtlijn.succescriteria.forEach(criteria => {
                if (criteria.niveau) niveaus.add(criteria.niveau);
            })
        );
		// return the array and sort it by length
        return Array.from(niveaus).sort((a, b) => a.length - b.length);
    }

    // Get the progress for each principe and niveau
    function getProgress(principe, niveau) {
        // All succescriteria for this principe and niveau
        const total = principe.richtlijnen.flatMap(r => r.succescriteria)
            .filter(sc => sc.niveau === niveau).length;

        // All succescriteria that are achieved for this principe and niveau
        const behaald = urlData.url.checks.flatMap(check => check.succescriteria)
            .filter(sc => sc.niveau === niveau && sc.index.startsWith(principe.index + '.')).length;

        return { total, behaald };
    }
</script>

<aside>
    <ul>
        {#each principes as principe}
            <li data-sveltekit-reload>
                <a href="{baseUrl}/{principe.slug}">
                    <h4>{principe.titel}</h4>
                    <span>Principe {principe.index}</span>
                    {#each getNiveausForPrincipe(principe) as niveau}
                        <div class="progress-container">
							<span>{niveau}</span>
                            <progress
							id="progress-partner"
                                max={getProgress(principe, niveau).total || 1}
                                value={getProgress(principe, niveau).behaald || 0}
                            />
                            <label class="progress-percentage" for="progress-partner">
                                {getProgress(principe, niveau).total
                                    ? Math.round(
                                        (getProgress(principe, niveau).behaald /
                                            getProgress(principe, niveau).total) * 100
                                      )
                                    : 0
                                }%
                            </label>
                        </div>
                    {/each}
                </a>
            </li>
        {/each}
    </ul>
</aside>

<style>
	h4 {
		font-size: 1.5rem;
		font-weight: 500;
		font-family: 'Inter', sans-serif;
	}

	span {
		font-weight: 100;
	}

	aside {
		display: block;
		position: -webkit-sticky;
		position: sticky;
		top: calc(90px + 1em);
		height: 100%;
		background-color: var(--c-container);
		border-radius: 0.5em;
		border: solid 1px var(--c-container-stroke);
		flex-grow: 400;
		flex-basis: 0;
		align-self: start;
	}

	li {
		display: flex;
	}

	li:hover {
		background-color: #3b3939;
	}

	a {
		width: 100%;
		height: 100%;
		border-bottom: 1px solid var(--c-container-stroke);
		padding: 1em;
		color: white;
		text-decoration: none;
	}

	span {
		font-weight: 100;
	}

	div {
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
		height: 10px;
	}

	progress[value]::-webkit-progress-bar {
		background-color: var(--c-container-stroke);
		border-radius: 0.5em;
	}

	progress[value]::-webkit-progress-value {
		background-color: var(--c-orange);
		border-radius: 0.5em;
	}

	label {
		height: 85%;
	}
</style>
