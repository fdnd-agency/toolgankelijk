<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import Heading from '$lib/components/heading.svelte';
	import NavButton from '$lib/components/NavButton.svelte';

	let { data } = $props();

	let heading = $derived({
		title: data.websitesData.website.title,
		homepage: data.urlData.url.url,
		url: data.urlData.url.slug
	});
	let progressData = $state({});
	// every progress bar for the level of the principles
	const principles = $derived(data.principlesData.principles);
	// !== filters out level A
	const levels = $derived.by(() =>
		data.levelData.levels.filter((level) => level.level.toLowerCase() !== 'a')
	);
	const checks = $derived(data.urlData.url.checks);

	for (const principle of principles) {
		// save the index of the principle in the progressData object
		const pIndex = principle.index;
		progressData[pIndex] = { total: 0, achieved: 0, levels: {} };

		// for each principle, loop through the levels
		for (const level of levels) {
			const levelName = level.level;

			// All success criteria for this principle with this level
			const totalChecks = principle.guidelines
				.flatMap((guideline) => guideline.successCriteria)
				.filter((successCriterion) => successCriterion.level === levelName);

			// All success criteria that are achieved for this principle with this level
			const successChecks = checks
				.flatMap((check) => check.successCriteria)
				.filter(
					(successCriterion) =>
						successCriterion.level === levelName && successCriterion.index.startsWith(pIndex + '.')
				);

			// Initialize the progressData for this principle and level
			progressData[pIndex].levels[levelName] = {
				total: totalChecks.length,
				achieved: successChecks.length
			};

			// Aggregate for the main principle bar
			progressData[pIndex].total += totalChecks.length;
			progressData[pIndex].achieved += successChecks.length;
		}
	}

	// Helper to calculate percentage safely
	const getPercent = (achieved, total) => (total > 0 ? Math.round((achieved / total) * 100) : 0);
</script>

<Heading {heading} />

<section class="container-principles">
	<ul>
		{#each principles as principle (principle.index)}
			{@const pData = progressData[principle.index]}
			<li class="principle-card color-primary">
				<a href="{$page.url.pathname}/{principle.slug}" class="principle-link">
					<div class="principle-header">
						<span class="label">
							<span class="label-text">Principe</span>
						</span>
						<h2>{principle.title}</h2>
						<p class="description">{@html principle.description}</p>
					</div>
					<div class="levels-list">
						{#each levels as level}
							{@const nData = pData.levels[level.level]}
							<div class="level-sub-card color-primary">
								<span class="level-label">Niveau</span>
								<span class="level-name">{level.level}</span>
								<div class="progress-row">
									<progress max={nData.total || 1} value={nData.achieved || 0}></progress>
									<span class="percentage-text">{getPercent(nData.achieved, nData.total)}%</span>
								</div>
							</div>
						{/each}
					</div>
				</a>

				<NavButton
					variant="secondary"
					showIcon={false}
					href="{$page.url.pathname}/{principle.slug}"
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
	.principle-link {
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
