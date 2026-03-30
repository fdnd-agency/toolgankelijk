<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import Heading from '$lib/components/heading.svelte';

	let { data } = $props();

	let heading = $derived({
		titel: data.websitesData.website.titel,
		homepage: data.urlData.url.url,
		url: data.urlData.url.slug
	});

	let progressData = $state({});
	// every progress bar for the niveau of the principes
	const principes = data.principesData.principes;
    // !== filters out niveau a
	const niveaus = data.niveauData.niveaus.filter((n) => n.niveau.toLowerCase() !== 'a');
	const checks = data.urlData.url.checks;

	principes.forEach((principe) => {
		// save the index of the principe in the progressData object
		const pIndex = principe.index;
		progressData[pIndex] = { total: 0, behaald: 0, levels: {} };

		// for each principe, loop through the niveaus
		niveaus.forEach((niveau) => {
			const niveauName = niveau.niveau;

			// All succescriteria for this principe with this niveau
			const totalChecks = principe.richtlijnen
				.flatMap((r) => r.succescriteria)
				.filter((c) => c.niveau === niveauName);

			// All succescriteria that are achieved for this principe with this niveau
			const successChecks = checks
				.flatMap((c) => c.succescriteria)
				.filter((c) => c.niveau === niveauName && c.index.startsWith(pIndex + '.'));

			// Initialize the progressData for this principe and niveau
			progressData[pIndex].levels[niveauName] = {
				total: totalChecks.length,
				behaald: successChecks.length
			};

			// Aggregate for the main principle bar
			progressData[pIndex].total += totalChecks.length;
			progressData[pIndex].behaald += successChecks.length;
		});
	});

	// Helper to calculate percentage safely
	const getPercent = (behaald, total) => (total > 0 ? Math.round((behaald / total) * 100) : 0);
</script>

<Heading {heading} />

<section class="container-principes">
	<ul>
		{#each principes as principe (principe.index)}
			{@const pData = progressData[principe.index]}
			<li class="principe-card">
				<a href="{$page.url.pathname}/{principe.slug}" class="principe-link">
					<div class="principe-header">
						<span class="label">▶ Principe</span>
						<h2>{principe.titel}</h2>
						<p class="description">{principe.beschrijving.text}</p>
                        <!-- Comments out the progress bar of niveau A -->
						<!-- <div class="main-progress">
							<progress max={pData.total} value={pData.behaald}></progress>
							<span class="percentage-text">{getPercent(pData.behaald, pData.total)}%</span>
						</div> -->
					</div>

					<div class="niveaus-list">
						{#each niveaus as n}
							{@const nData = pData.levels[n.niveau]}
							<div class="niveau-sub-card">
								<span class="niveau-label">Niveau</span>
								<span class="niveau-name">{n.niveau}</span>
								<div class="progress-row">
									<progress max={nData.total || 1} value={nData.behaald || 0}></progress>
									<span class="percentage-text">{getPercent(nData.behaald, nData.total)}%</span>
								</div>
							</div>
						{/each}
					</div>
				</a>
			</li>
		{/each}
	</ul>
</section>

<style>
	:root {
		--bg-pink: #e9c2c9;
		--card-pink: #dfa0b3;
		--subcard-pink: #d689a3;
		--progress-fill: #b30059;
		--progress-bg: #f0f0f0;
		--text-main: #b30059;
	}

	.principe-link {
		text-decoration: none;
		color: inherit;
		display: block;
	}

	.container-principes {
		gap: 1rem;
		margin: 1em 1em;
		border-radius: 0.5em;
        
	}

	.container-principes ul {
		list-style: none;
		padding: 2rem;
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 2rem;
		background-color: var(--bg-pink);
        border-radius: 0.5em;
	}

	/* responsive for mobile */
	@media (max-width: 768px) {
		.container-principes ul {
			grid-template-columns: 1fr;
		}
	}

	.principe-card {
		background-color: var(--card-pink);
		border-radius: 20px;
		padding: clamp(1em, 6vw, 2em);
		color: var(--text-main);
		font-family: sans-serif;
		margin: 1em 1em;
	}

	.label {
		font-size: 0.8rem;
		font-weight: bold;
	}

	h2 {
		font-size: 2.2rem;
		margin: 0.2rem 0;
		font-weight: 800;
	}

	.description {
		font-size: 0.95rem;
		line-height: 1.4;
		margin-bottom: 1.5rem;
		color: rgba(179, 0, 89, 0.8);
	}

	/* Progress Bar Styling */
	.main-progress,
	.progress-row {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	progress {
		flex-grow: 1;
		height: 12px;
		appearance: none;
		-webkit-appearance: none;
	}

	progress::-webkit-progress-bar {
		background-color: white;
		border-radius: 10px;
	}

	progress::-webkit-progress-value {
		background-color: var(--progress-fill);
		border-radius: 10px;
	}

	.percentage-text {
		font-size: 0.9rem;
		min-width: 35px;
		color: rgba(179, 0, 89, 0.6);
	}

	/* Sub-cards for A, AA, AAA */
	.niveaus-list {
		margin-top: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.niveau-sub-card {
		background-color: var(--subcard-pink);
		padding: 1rem 1.5rem;
		border-radius: 15px;
	}

	.niveau-label {
		display: block;
		font-size: 0.75rem;
		opacity: 0.7;
	}
	.niveau-name {
		font-size: 1.5rem;
		font-weight: bold;
		display: block;
		margin-bottom: 0.5rem;
	}
</style>
