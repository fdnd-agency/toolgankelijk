<script>
	// side bar needs to be refactored
	import NavButton from './navButton.svelte';
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
		const achieved = urlData.url.checks
			.flatMap((check) => check.successCriteria)
			.filter((sc) => sc.level === level && sc.index.startsWith(principle.index + '.')).length;

		return { total, achieved };
	}
</script>

<aside>
	<ol>
		{#each principles as principle}
			<li>
				<h3>{principle.title}</h3>
				<div class="progress-container">
					{#each getLevelsForPrinciple(principle) as level}
							<p>{level}</p>

							<progress
								id="progress-partner-{level}"
								max={getProgress(principle, level).total || 1}
								value={getProgress(principle, level).achieved || 0}
							></progress>

							<label class="progress-percentage" for="progress-partner-{level}">
								{getProgress(principle, level).total
									? Math.round(
											(getProgress(principle, level).achieved / getProgress(principle, level).total) *
												100
										)
									: 0}%
							</label>
					{/each}
				</div>
			</li>
		{/each}
	</ol>
</aside>

<style>
	aside {
		position: sticky;
		top: 1em;
		background-color: var(--color-primary-lightest);
		border-radius: var(--border-radius);
		flex-grow: 400;
		flex-basis: 0;
		height: fit-content;
		max-width: 18.5rem;
	}

	li {
		padding: 1em;
		list-style: none;
	}

	.progress-container {
		display: grid;
		grid-template-columns: auto 1fr auto;
		gap: var(--gap-small);
		align-items: center;
	}

	progress {
		width: 100%;
	}

	progress[value] {
		-webkit-appearance: none;
		height: .5em;
	}

	progress[value]::-webkit-progress-bar {
		background-color: var(--color-neutral-white);
		border-radius: 0.5em;
	}

	progress[value]::-webkit-progress-value {
		background-color: var(--color-primary);
		border-radius: 0.5em;
	}
</style>
