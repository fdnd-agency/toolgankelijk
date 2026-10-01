<script>
	// server-side form to add a partner or url, posts to the given form action of the current page
	import { enhance } from '$app/forms';
	import { replaceState } from '$app/navigation';

	let { action, nameLabel, urlLabel, closeHref } = $props();

	let submitting = $state(false);

	// enhancement: submit without a page reload and close the overlay when saving worked
	function handleSubmit() {
		submitting = true;

		return async ({ result, update }) => {
			const saved = result.type === 'success' && result.data?.success;

			// keep the typed values when saving failed so the user can fix them
			await update({ reset: saved });
			submitting = false;

			// remove ?add from the url without a new navigation, so the toast stays visible
			if (saved) replaceState(closeHref, {});
		};
	}
</script>

<form method="POST" {action} use:enhance={handleSubmit} aria-busy={submitting}>
	<label for="name">{nameLabel}</label>
	<!-- svelte-ignore a11y_autofocus -->
	<input id="name" name="name" required type="text" autofocus />

	<label for="url">{urlLabel}</label>
	<input id="url" name="url" required type="url" placeholder="https://" />

	<button type="submit" disabled={submitting}>
		{submitting ? 'Bezig met toevoegen...' : 'Toevoegen'}
	</button>
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

	button:disabled {
		opacity: 0.6;
		cursor: wait;
	}

	button:hover {
		filter: brightness(1.1);
	}

	button:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 2px;
	}
</style>
