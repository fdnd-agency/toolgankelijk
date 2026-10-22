<script>
	import { page } from '$app/stores';
	import Heading from '$lib/components/molecules/heading.svelte';
	import NavButton from '$lib/components/molecules/navButton.svelte';
	import SubHeader from '$lib/components/templates/subheader.svelte';

	let { data } = $props();

	// heading should be different on every page
	let heading = $derived({
		title: data?.websitesData?.website?.title ?? 'Loading...',
		homepage: data?.urlData?.url?.url ?? '',
		url: data?.urlData?.url?.slug ?? ''
	});

	let progressData = $state({});

	const principes = data.principlesData.principles;
	const niveaus = data.levelData.levels.filter((n) => n.level.toLowerCase() !== 'a');

	const checks = data.urlData.url.checks;

	// the chosen filters come from the url via the load function (?principe=...&niveau=...)
	const filterValue = (name) => data.filters.find((filter) => filter.name === name)?.value;

	let selectedPrinciple = $derived(filterValue('principe'));
	let selectedLevel = $derived(filterValue('niveau'));

	let filteredPrincipes = $derived(
		principes.filter((p) => selectedPrinciple === 'alle' || p.slug === selectedPrinciple)
	);

	let filteredNiveaus = $derived(
		niveaus.filter((n) => selectedLevel === 'alle' || n.level === selectedLevel)
	);

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

<!-- all the principles containers (shows data of a principle) -->
<section class="container-principles">
	<ul>
		{#each filteredPrincipes as principe (principe.index)}
			{@const pData = progressData[principe.index]}

			<li class="principle-card">
				<a href="{$page.url.pathname}/{principe.slug}" class="principle-link">
					<div class="principle-header">
						<h2>{principe.title}</h2>
					</div>

					<div class="levels-list">
						{#each filteredNiveaus as n}
							{@const nData = pData.levels[n.level]}
							<div class="level-sub-card">
								<h3 class="h3-niveaus">Niveau {n.level}</h3>
								<div class="progress-row">
									<progress max={nData.total || 1} value={nData.achieved || 0}> </progress>
									<p class="percentage-text">{getPercent(nData.achieved, nData.total)}%</p>
								</div>
							</div>
						{/each}
					</div>
				</a>

				<div class="custom-nav-override">
					<NavButton
						variant="secondary"
						showIcon={false}
						href="{$page.url.pathname}/{principe.slug}"
						size="medium"
						aria="Open Principe"
					>
						<p>Open</p>
					</NavButton>
				</div>
			</li>
		{/each}
	</ul>
</section>

<!-- in the new design the sidebar will appear here -->

<style>
	.container-principles a {
		text-decoration: none;
		color: inherit;
		display: block;
	}

	.container-principles {
		gap: 1rem;
		border-radius: var(--border-radius);
		color: var(--color-neutral-white);
	}

	.container-principles ul {
		list-style: none;
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		border-radius: var(--border-radius);
	}

	.h3-niveaus {
		font-size: 24px;
	}

	@media (max-width: 768px) {
		.container-principles ul {
			grid-template-columns: 1fr;
		}
	}

	.principle-card {
		background-color: var(--color-background-card);
		border-radius: var(--border-radius);
		padding: 1em;
		color: var(--color-neutral-black);
		font-family: sans-serif;
		margin: 1em 1em;
		box-shadow: 0px 4px 10px -2px rgba(0, 0, 0, 0.25);
	}

	.progress-row {
		display: flex;
		align-items: center;
		gap: 1rem;

		p {
			display: flex;
			align-items: center;
			font-size: 24px;
			margin-top: 0.2em;
		}
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

	.levels-list {
		margin-top: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		background-color: var(--color-background-card);
	}

	.percentage-text {
		font-weight: bold;
		font-size: 0.9rem;
	}

	progress {
		width: 100%;
		height: 10px;
		appearance: none;
		-webkit-appearance: none;
		height: 1em;
	}

	progress::-webkit-progress-bar {
		background-color: var(--color-neutral-white);
		border-radius: var(--border-radius);
		border: var(--color-neutral-black) solid 1px;
	}

	progress::-webkit-progress-value {
		background-color: var(--color-primary);
		border-radius: var(--border-radius);
	}

	.custom-nav-override :global(button),
	.custom-nav-override :global(a) {
		background-color: #b9005f !important;
		border-color: #b9005f !important;
		color: white !important;
	}
</style>
