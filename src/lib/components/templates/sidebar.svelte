<script>
	// side bar needs to be refactored
	import NavButton from '../molecules/navButton.svelte';
	let { principles, urlData } = $props();

	let baseUrl = $derived(`/${urlData.url.website.slug}/${urlData.url.slug}`);

	// Get the levels for each principle
	function getLevelsForPrinciple(principle) {
		const levels = new Set();
		principle.guidelines.forEach((guideline) =>
			guideline.successCriteria.forEach((criteria) => {
				if (criteria.level) levels.add(criteria.level);
			})
		);
		// return the array and sort it by length
		return Array.from(levels).sort((a, b) => a.length - b.length);
	}

	// Get the progress for each principle and level
	function getProgress(principle, level) {
		// All successcriteria for this principle and level
		const total = principle.guidelines
			.flatMap((g) => g.successCriteria)
			.filter((sc) => sc.level === level).length;

		// All successcriteria that are achieved for this principle and level
		const behaald = urlData.url.checks
			.flatMap((check) => check.successCriteria)
			.filter((sc) => sc.level === level && sc.index.startsWith(principle.index + '.')).length;

		return { total, behaald };
	}
</script>

<aside>
	<ul>
		{#each principles as principle}
			<li>
				<h3>{principle.title}</h3>
				<div class="progress-container">
					{#each getLevelsForPrinciple(principle) as level}
						<p>{level}</p>

						<progress
							id="progress-partner-{level}"
							max={getProgress(principle, level).total || 1}
							value={getProgress(principle, level).behaald || 0}
						></progress>

						<label class="progress-percentage" for="progress-partner-{level}">
							{getProgress(principle, level).total
								? Math.round(
										(getProgress(principle, level).behaald / getProgress(principle, level).total) *
											100
									)
								: 0}%
						</label>
					{/each}
				</div>
			</li>
		{/each}
	</ul>
</aside>

<style>
	aside {
		display: block;
		position: -webkit-sticky;
		position: sticky;
		top: calc(90px + 1em);
		height: 100%;
		background-color: var(--color-primary);
		border-radius: var(--border-radius);
		border: solid 1px var(--color-neutral-white);
		flex-grow: 400;
		flex-basis: 0;
		align-self: start;
	}

	li:hover {
		background-color: var(--color-neutral-black);
		border-radius: var(--border-radius);
	}

	li {
		width: 100%;
		height: 100%;
		border-bottom: 1px solid var(--c-container-stroke);
		padding: 1em;
		color: white;
		text-decoration: none;
	}

	.progress-container {
		display: flex;
		gap: 1em;
		flex-direction: column;
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
		background-color: var(--color-neutral-white);
		border-radius: 0.5em;
	}

	progress[value]::-webkit-progress-value {
		background-color: var(--color-primary-light);
		border-radius: 0.5em;
	}

	label {
		height: 85%;
	}
</style>
