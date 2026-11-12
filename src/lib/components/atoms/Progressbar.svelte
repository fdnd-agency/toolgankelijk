<script>
	// Progress for one level: renders <p>, <progress> and <label> without a wrapper,
	// so the parent decides the layout (e.g. a 3-column grid).
	let { id, level, achieved = 0, total = 0 } = $props();

	let percentage = $derived(total ? Math.round((achieved / total) * 100) : 0);
</script>

<p>{level}</p>

<progress {id} max={total || 1} value={achieved}></progress>

<label class="progress-percentage" for={id}>{percentage}%</label>

<style>
	progress {
		width: 100%;
	}

	progress[value] {
		-webkit-appearance: none;
		appearance: none;
		height: 0.5em;
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
