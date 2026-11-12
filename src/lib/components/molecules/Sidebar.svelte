<script>
	// side bar needs to be refactored
	import NavButton from './navButton.svelte';
	import Progressbar from '$lib/components/atoms/Progressbar.svelte';
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
	<ol role="list">
		{#each principles as principle}
			<li>
				<h3>{principle.title}</h3>
				<div class="progress-container">
					{#each getLevelsForPrinciple(principle) as level}
						{@const { achieved, total } = getProgress(principle, level)}
						<Progressbar id="progress-{principle.index}-{level}" {level} {achieved} {total} />
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

	ol {
		/* list-style-position: inside; */
		list-style: none;
		counter-reset: principle;
	}

	li {
		padding: 1em;
		counter-increment: principle;
	}

	h3::before {
		content: counter(principle) '. ';
	}

	.progress-container {
		display: grid;
		grid-template-columns: auto 1fr auto;
		gap: var(--gap-small);
		align-items: center;
	}
</style>
