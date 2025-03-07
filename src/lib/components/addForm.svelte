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
			<label for="url" class="url-label">Slug</label>
			<input id="slug" name="slug" type="name" value={params} readonly/>
			{/if}

			<div class="button-div">
				<button type="submit" class="add-button">Toevoegen</button>
				<button class="remove-button" on:click={close}>Sluit</button>
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
		max-width: 30em;
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

	.form-container {
		background-color: var(--c-container);
		border: solid 1px var(--c-container-stroke);
		border-radius: 0.5em;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
		gap: 0.5rem;
		padding: 1.2em;
	}

	.form-container {
		line-height: 2em;
		width: 100%;
	}

	h2 {
		border-bottom: 1px solid var(--c-container-stroke);
		width: 100%;
		padding-bottom: 0.25em;
		color: var(--c-white);
	}

	form {
		margin-top: 1em;
	}

	.button-div {
		display: flex;
		flex-direction: row;
	}

	.add-button {
		border: none;
		background-color: var(--c-pink);
		color: white;
		padding: 0.5em 1em;
		cursor: pointer;
		text-decoration: none;
		transition: 0.3s;
		border-radius: 0.25em;
		margin-top: 1em;
		margin-right: 1rem;
		font-size: 1em;
	}

	.remove-button {
		border: none;
		background-color: var(--c-container-stroke);
		color: white;
		padding: 0.5em 1em;
		cursor: pointer;
		text-decoration: none;
		transition: 0.3s;
		border-radius: 0.25em;
		margin-top: 1em;
		font-size: 1em;
		transition: 0.2s ease-in;
	}

	.remove-button:hover {
		background-color: var(--c-pink);
	}

	input {
		width: 100%;
		padding: 12px 20px;
		display: inline-block;
		border: 1px solid #ccc;
		border-radius: 4px;
		box-sizing: border-box;
		max-width: 700px;
	}

	input:focus {
		outline: 0.1rem solid var(--c-orange);
	}

	.add-button:hover {
		opacity: 0.75;
	}

	.url-label {
		margin-top: 1em;
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
	}
</style>
