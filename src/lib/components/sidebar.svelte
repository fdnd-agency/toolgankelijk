<script>
	let { principles, urlData } = $props();

	let baseUrl = $derived(`/${urlData.url.website.slug}/${urlData.url.slug}`);

	// Get the levels for each principle
	function getLevelsForPrinciple(principle) {
		const levels = new Set();
		principle.guidelines.forEach((guideline) =>
			guideline.successcriteria.forEach((criteria) => {
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
			.flatMap((g) => g.successcriteria)
			.filter((sc) => sc.level === level).length;

		// All successcriteria that are achieved for this principle and level
		const behaald = urlData.url.checks
			.flatMap((check) => check.successcriteria)
			.filter((sc) => sc.level === level && sc.index.startsWith(principle.index + '.')).length;

		return { total, behaald };
	}
</script>

<aside>
	<ul>
		{#each principles as principle}
			<li data-sveltekit-reload>
				<a href="{baseUrl}/{principle.slug}">
					<h4>{principle.title}</h4>
					<span>Principe {principle.index}</span>
					{#each getLevelsForPrinciple(principle) as level}
						<div class="progress-container">
							<span>{level}</span>
							<progress
								id="progress-partner-{level}"
								max={getProgress(principle, level).total || 1}
								value={getProgress(principle, level).behaald || 0}
							></progress>
							<label class="progress-percentage" for="progress-partner-{level}">
								{getProgress(principle, level).total
									? Math.round(
											(getProgress(principle, level).behaald /
												getProgress(principle, level).total) *
												100
										)
									: 0}%
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
