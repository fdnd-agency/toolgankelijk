<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import Heading from '$lib/components/heading.svelte';
	import NavButton from '$lib/components/NavButton.svelte';
	import Subheader from '$lib/components/subheader.svelte';

	let { data } = $props();

	let heading = $derived({
		title: data.websitesData.website.title,
		homepage: data.urlData.url.url,
		url: data.urlData.url.slug
	});
	let progressData = $state({});

	const principes = data.principlesData.principles;
	const niveaus = data.levelData.levels.filter((n) => n.level.toLowerCase() !== 'a');

	const checks = data.urlData.url.checks;

	let activeFilters = $state({
		principle: 'All',
		level: 'All',
		showNotMet: false,
		showMet: false
	});

	let filteredPrincipes = $derived(
		principes.filter((p) => {
			if (activeFilters.principle !== 'All' && p.title !== activeFilters.principle) {
				return false;
			}

			const filteringVoldaan = activeFilters.showMet && !activeFilters.showNotMet;
			const filteringNietVoldaan = activeFilters.showNotMet && !activeFilters.showMet;

			if (filteringVoldaan || filteringNietVoldaan) {
				let total = 0;
				let behaald = 0;

				// Check progress against the currently active Niveau (or all of them if "All" is selected)
				const niveausToCheck =
					activeFilters.level === 'All' ? niveaus.map((n) => n.level) : [activeFilters.level];

				niveausToCheck.forEach((niv) => {
					if (progressData[p.index] && progressData[p.index].levels[niv]) {
						total += progressData[p.index].levels[niv].total;
						behaald += progressData[p.index].levels[niv].achieved;
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
			return n.level === activeFilters.level;
		})
	);

	function handleApplyFilters(newFilters) {
		activeFilters = newFilters;
	}

	principes.forEach((principe) => {
		const pIndex = principe.index;
		progressData[pIndex] = { total: 0, achieved: 0, levels: {} }; // Changed 'behaald' to 'achieved' for consistency

		niveaus.forEach((niveau) => {
			const niveauName = niveau.level; // From our previous fix

			// 1. Crash-proof totalChecks (Check if it's guidelines OR richtlijnen!)
			const guidelinesArray = principe.guidelines || principe.richtlijnen || [];

			const totalChecks = guidelinesArray
				// Use ?. just in case successCriteria is missing on a specific guideline
				.flatMap((guideline) => guideline.successCriteria || guideline.succescriteria || [])
				// Make sure to use .level here, not .niveau!
				.filter((successCriterion) => successCriterion.level === niveauName);

			// 2. Crash-proof successChecks
			const safeChecks = checks || [];
			const successChecks = safeChecks
				.flatMap((check) => check.successCriteria || [])
				.filter(
					(successCriterion) =>
						successCriterion.level === niveauName && successCriterion.index.startsWith(pIndex + '.')
				);

			// Initialize the progressData for this principle and level
			progressData[pIndex].levels[niveauName] = {
				total: totalChecks.length,
				achieved: successChecks.length
			};

			// Aggregate for the main principle bar
			progressData[pIndex].total += totalChecks.length;
			progressData[pIndex].achieved += successChecks.length;
		});
	});

	// Helper to calculate percentage safely
	const getPercent = (achieved, total) => (total > 0 ? Math.round((achieved / total) * 100) : 0);
</script>

<Heading {heading} />

<Subheader partnerTitle={data.websitesData.website.title} onApply={handleApplyFilters} />

<section class="container-principles">
	<ul>
		{#each filteredPrincipes as principe (principe.index)}
			{@const pData = progressData[principe.index]}

			<li class="principle-card color-primary">
				<a href="{$page.url.pathname}/{principe.slug}" class="principle-link">
					<div class="principle-header">
						<span class="label">
							<span class="label-text">Principle</span>
						</span>
						<h2>{principe.title}</h2>
						<p class="description">{principe.description.text}</p>
					</div>

					<div class="levels-list">
						{#each filteredNiveaus as n}
							{@const nData = pData.levels[n.level]}
							<div class="level-sub-card color-primary">
								<span class="level-label">Niveau</span>
								<span class="level-name">{n.level}</span>
								<div class="progress-row">
									<progress max={nData.total || 1} value={nData.achieved || 0}> </progress>
									<span class="percentage-text">{getPercent(nData.achieved, nData.total)}%</span>
								</div>
							</div>
						{/each}
					</div>
				</a>

				<NavButton
					variant="secondary"
					showIcon={false}
					href="{$page.url.pathname}/{principe.slug}"
					size="medium"
					aria="Open Principe"
				>
					<p>Open</p>
				</NavButton>
			</li>
		{/each}
	</ul>
</section>

<style>
	.container-principles a {
		text-decoration: none;
		color: inherit;
		display: block;
	}

	.container-principles {
		gap: 1rem;
		border-radius: var(--border-radius);
	}

	.container-principles ul {
		list-style: none;
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		border-radius: var(--border-radius);
	}

	/* responsive for mobile */
	@media (max-width: 768px) {
		.container-principles ul {
			grid-template-columns: 1fr;
		}
	}

	.principle-card {
		background-color: var(--color-primary-light);
		border-radius: 20px;
		padding: clamp(1em, 6vw, 2em);
		color: var(--color-primary);
		font-family: sans-serif;
		margin: 1em 1em;
	}

	.label {
		font-size: 0.8rem;
		font-weight: bold;
	}

	.label-text {
		color: var(--dark-1);
		opacity: 1;
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
		color: var(--dark-1);
	}

	.main-progress,
	.progress-row {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	progress {
		flex-grow: 1;
		height: 8px;
		appearance: none;
		-webkit-appearance: none;
	}

	.percentage-text {
		font-size: 0.9rem;
		min-width: 35px;
		color: var(--color-neutral-darkgrey);
	}

	/* Sub-cards for A, AA, AAA */
	.levels-list {
		margin-top: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.level-sub-card.color-primary {
		background-color: var(--light-2);
		padding: 1.25rem 1rem;
		border-radius: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-bottom: 0.5rem;
		border: none;
	}

	.level-label {
		color: var(--dark-2);
		font-size: 0.8rem;
		font-weight: 500;
		margin-bottom: -5px;
	}

	.level-name {
		color: var(--dark-3);
		font-size: 1.8rem;
		font-weight: 800;
		line-height: 1;
	}

	.percentage-text {
		color: var(--dark-3);
		font-weight: bold;
		font-size: 0.9rem;
	}

	progress {
		width: 100%;
		height: 10px;
		appearance: none;
		-webkit-appearance: none;
	}

	progress::-webkit-progress-bar {
		background-color: var(--color-neutral-white);
		border-radius: 10px;
	}

	progress::-webkit-progress-value {
		background-color: var(--color-primary);
		border-radius: 10px;
	}
</style>
