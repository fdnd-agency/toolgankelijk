<script>
		import { onMount } from 'svelte';

		let progressbar;
		let url;
		let websiteCriteria;
		let totalCriteria;

		onMount(() => {
		if (isUrl) {
			websiteCriteria = website.checks.reduce((total, check) => {
				const criteria = check.successCriteria ?? [];
				return total + criteria.length;
			}, 0);

			totalCriteria =
				principles.reduce((total, principle) => {
					principle.guidelines.forEach((guideline) => {
						const criteria = guideline.successCriteria ?? [];
						total += criteria.length;
					});
					return total;
				}, 0) * website.checks.length;
		} else {
			websiteCriteria = website.urls.reduce((total, url) => {
				url.checks.forEach((check) => {
					const criteria = check.successCriteria ?? [];
					total += criteria.length;
				});
				return total;
			}, 0);

			totalCriteria =
				principles.reduce((total, principle) => {
					principle.guidelines.forEach((guideline) => {
						const criteria = guideline.successCriteria ?? [];
						total += criteria.length;
					});
					return total;
				}, 0) * website.urls.length;
		}

		let percentage = Math.round((websiteCriteria / totalCriteria) * 100);
		if (isNaN(percentage)) {
			percentage = 0;
		}
		progressbar.value = websiteCriteria;
		progressbar.max = totalCriteria;
		labelValue.innerHTML = `${percentage}%`;
	});
</script>

<div class="progressbar-container">
	<!-- automatically tested -->
	<progress class="progress-automatically-tested" max="100" value="80"></progress>
	<!-- manual tests -->
	<!-- <progress class="progress-manually-tested" max="100" value="80"></progress> -->
	<label class="progess-label">80%</label>
</div>

<style>
.progressbar-container {
	display: flex;
	gap: 2em;
}

.progress-automatically-tested {
	width: 100%;
	margin-left: 1em;
	height: 4em;
}

.progess-label {
	font-size: 28px;
}

	progress {
		width: 100%;
		border-radius: 0.5rem;
		background-color: var(--color-neutral-darkgrey);
		border: none;
		overflow: hidden;
	}

	progress::-webkit-progress-bar {
		background-color: var(--color-neutral-darkgrey);
		border-radius: var(--border-radius);
	}

	progress::-webkit-progress-value {
		background-color: var(--color-primary);
		border-radius: 0.5rem;
		transition: width 1s ease-out;
	}

	progress::-moz-progress-bar {
		background-color: var(--color-primary);
		border-radius: 0.5rem;
		transition: width 1s ease-out;
	}

	.progress-percentage {
		height: 85%;
	}





</style>