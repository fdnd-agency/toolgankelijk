<script>
	// server-side form to add a partner or url, posts to the given form action of the current page
	let { action, nameLabel, urlLabel } = $props();
</script>

<form method="POST" {action}>
	<label for="name">{nameLabel}</label>
	<!-- svelte-ignore a11y_autofocus -->
	<input id="name" name="name" required type="text" autofocus />

	<label for="url">{urlLabel}</label>
	<input id="url" name="url" required type="url" placeholder="https://" />

	<button type="submit">Toevoegen</button>
</form>

<style>
	form {
		display: flex;
		flex-direction: column;
		gap: 0.5em;
	}

	input {
		width: 100%;
		max-width: 22em;
		box-sizing: border-box;
		padding: 0.75em 1em;
		border: 1px solid var(--color-neutral-grey);
		border-radius: 4px;
		background-color: var(--color-neutral-white);
		font-size: 1em;
	}

	input:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 1px;
	}

	button {
		align-self: flex-start;
		margin-top: 1.5em;
		padding: 0.6em 3em;
		border: none;
		border-radius: 4px;
		background-color: var(--color-primary);
		color: var(--color-neutral-white);
		font-size: 1em;
		font-weight: bold;
		cursor: pointer;
	}

	button:hover {
		filter: brightness(1.1);
	}

	button:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 2px;
	}
</style>
