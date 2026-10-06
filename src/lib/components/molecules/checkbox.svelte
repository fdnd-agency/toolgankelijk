<script>
	let { name, value, checked = false } = $props();
</script>

<!-- the checkbox appears on the checklist for the manual checks -->
<input {name} {value} type="checkbox" {checked} />

<style>
	input {
		appearance: none;
		margin: 0;
		flex-shrink: 0;
		width: 2em;
		height: 2em;
		border: 0.15em solid var(--color-primary);
		border-radius: 0.3em;
		display: grid;
		place-content: center;
        transition: .1s;
        cursor: pointer;
	}

	input:hover {
		filter: brightness(1.1);
		background-color: var(--color-primary);
	}

	input::before {
		content: '';
		width: 1em;
		height: 1em;
		clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
		transform: scale(0);
		background-color: var(--color-neutral-white);
	}

	input:checked::before {
		transform: scale(1);
	}

	input:checked {
		background-color: var(--color-primary);
	}
</style>
