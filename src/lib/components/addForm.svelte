<script>
	// ==============================
	// Data variables
	// ==============================
	export let params;
	export let isUrl;
	// ==============================
	// Variables
	// ==============================
	let title;
	let action;
	let urlTitle;
	let dialog;
	let tip;
	// ==============================
	// Functions
	// ==============================
	if (isUrl) {
		title = "Url toevoegen";
		action = "?/addUrl";
		urlTitle = "Url titel";
		tip = "url";
	}else {
		title = "Partner toevoegen";
		action = "?/addPartner";
		urlTitle = "Partner titel";
		tip = "website";
	}

	export function open() {
        dialog.showModal();
    }

    function close(event) {
        event.preventDefault();
        dialog.close();
    }
</script>

<dialog bind:this={dialog}>
	<section class="form-container">
		<h2>{title}</h2>

		<div class="tip-message" aria-label="tip message">
			<p>Voeg een bestaande {tip} toe.</p>
		</div>

		<form method="POST" action="{action}">
			<label for="name">{urlTitle}</label>
			<input id="name" name="name" required type="text" placeholder="type een titel..." />

			<label for="url" class="url-label">Url</label>
			<input id="url" name="url" required type="url" placeholder="type een url link..."/>

			{#if isUrl}
			<label for="slug" class="slug-label">Slug</label>
			<input id="slug" name="slug" type="name" value={params} readonly/>
			{/if}

			<div class="button-div">
				<button type="submit" class="add-button">Toevoegen</button>
				<button class="remove-button" on:click={close}>Sluiten</button>
			</div>
		</form>
	</section>
</dialog>

<style>
	dialog {
		background-color: var(--c-container);
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		overflow: visible;
		width: 100%;
		max-width: 30rem;
		border: none;
		display: none;
	}

	dialog[open] {
		display: block;
	}

	dialog::backdrop {
		background-color: rgb(44, 44, 44);
		opacity: 0.8;
	}

	.form-container {
		background-color: var(--c-container);
		border: solid 0.1rem var(--c-container-stroke);
		border-radius: 0.5rem;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
		gap: 1rem;
		padding: 1.2rem;
		width: 100%;
	}

	h2 {
		border-bottom: 0.1rem solid var(--c-container-stroke);
		width: 100%;
		padding-bottom: 0.25rem;
		color: var(--c-white);
	}

	.tip-message {
		background-color: var(--c-container-stroke);
		display: flex;
		flex-direction: row;
		align-items: center;
		border-radius: 0.5rem;
		overflow: hidden;
		width: 100%;
	}

	.tip-message::before {
		content: "Tip";
		width: 2rem;
		height: 2.5rem;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: var(--c-orange);
		color: var(--c-white);
		font-weight: 600;
		padding: 0.25rem;
	}

	.tip-message p {
		padding: 0.25rem;
		color: var(--c-white);
		margin-left: 0.5rem;
	}

	form {
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
	}

	label {
		color: var(--c-white);
		margin-bottom: 0.5rem;
	}

	input {
		width: 100%;
		padding: 0.5rem 1rem;
		display: inline-block;
		border: 0.1rem solid var(--c-white);
		border-radius: 0.25rem;
		max-width: 30rem;
		margin-bottom: 1rem;
		font-size: 1rem;
	}

	input:focus {
		outline: 0.1rem solid var(--c-orange);
	}

	input:read-only {
		background-color: grey;
		color: var(--c-white);
	}

	.button-div {
		display: flex;
		flex-direction: row;
		gap: 1rem;
		width: 100%;
	}

	button {
		font-size: 1rem;
		border: none;
		color: var(--c-white);
		padding: 0.5rem 1rem;
		cursor: pointer;
		transition: 0.2s ease;
		border-radius: 0.25rem;
		width: 50%;
	}

	.add-button {
		background-color: var(--c-pink);
	}

	.remove-button {
		background-color: var(--c-container-stroke);
	}

	.add-button:hover {
		opacity: 0.75;
	}

	.remove-button:hover {
		background-color: var(--c-pink);
	}
</style>
