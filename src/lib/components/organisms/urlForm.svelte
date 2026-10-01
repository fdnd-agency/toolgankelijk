<script>
	// server-side form to add a url to a partner, posts to the addUrl form action
	let { params } = $props();
</script>

<section class="form-container">
	<h2>Url toevoegen</h2>
	<form method="POST" action="?/addUrl">
		<input name="slug" type="hidden" value={params} />

		<label for="name">Pagina titel</label>
		<input id="name" name="name" required type="text" />

		<label for="url">Pagina url</label>
		<input id="url" name="url" required type="url" placeholder="https://" />

		<button type="submit">Toevoegen</button>
	</form>
</section>

<style>
	.form-container {
		width: 100%;
		max-width: 700px;
		box-sizing: border-box;
		padding: 1.2em;
		border-radius: var(--border-radius, 8px);
		background-color: var(--color-background-card);
		color: var(--color-neutral-black);
	}

	h2 {
		margin: 0 0 1em;
		padding-bottom: 0.25em;
		border-bottom: 1px solid var(--color-neutral-grey);
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 0.5em;
	}

	input {
		width: 100%;
		box-sizing: border-box;
		padding: 0.75em 1em;
		border: 1px solid var(--color-neutral-grey);
		border-radius: 4px;
		font-size: 1em;
	}

	input:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 1px;
	}

	button {
		align-self: flex-start;
		margin-top: 1em;
		padding: 0.75em 1.5em;
		border: none;
		border-radius: var(--border-radius, 8px);
		background-color: var(--color-primary);
		color: var(--color-neutral-white);
		font-size: 1em;
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
