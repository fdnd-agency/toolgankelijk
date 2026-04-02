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
	const levels = $derived(data.levelData.levels);
	const checks = $derived(data.urlData.url.checks);

	for (const principle of principles) {
		// save the index of the principle in the progressData object
		const pIndex = principle.index;
		progressData[pIndex] = {};

		// for each principle, loop through the levels
		for (const level of levels) {
			const levelName = level.level;

			// All successcriteria for this principle with this level
			const totalChecks = (principle.guidelines ?? [])
				.flatMap((guideline) => guideline?.successCriteria ?? [])
				.filter((criteria) => criteria?.level === levelName);

			// All successcriteria that are achieved for this principle with this level
			const successChecks = (checks ?? [])
				.flatMap((check) => check?.successCriteria ?? [])
				.filter((criteria) => {
					return criteria?.level === levelName && criteria?.index?.startsWith(pIndex + '.');
				});

			// Initialize the progressData for this principle and level
			progressData[pIndex][levelName] = {
				total: totalChecks.length,
				behaald: successChecks.length
			};
		}
	}
</script>

<Heading {heading} />

<section class="container-principes">
	<ul>
		{#each principles as principle (principle.index)}
			<li>
				<a href="{$page.url.pathname}/{principle.slug}">
					<div class="principe">
						<h1>
							<span>{principle.title}.</span> Principe {principle.index}
						</h1>
						<p>{@html principle.description}</p>
						{#each levels as n}
							<p>{n.level}</p>
							<div class="progress-container">
								<progress
									name="progress-partner-{n.level}"
									id="progress-partner"
									max={progressData[principle.index][n.level].total || 1}
									value={progressData[principle.index][n.level].behaald || 0}
								></progress>
								<label class="progress-percentage" for="progress-partner-{n.level}">
									{progressData[principle.index]?.[n.level]
										? progressData[principle.index][n.level].total
											? Math.round(
													(progressData[principle.index][n.level].behaald /
														progressData[principle.index][n.level].total) *
														100
												)
											: 0
										: 0}%
								</label>
								<NavButton
									variant="secondary"
									showIcon={false}
									href="{$page.url.pathname}/{principle.slug}"
									size="medium"
									aria="Open Principe"
								>
									<p>Open</p>
								</NavButton>
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

	li {
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
