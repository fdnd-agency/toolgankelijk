<script>
	import Loader from '$lib/components/loader.svelte';

	export let params;
	export let isType;
	export let id;
	export let name;
	export let url;
	export let slug;

	let idValue = id ? id : "";
	let nameValue = name ? name : "";
	let urlValue = url ? url : "";
	let slugValue = params ? params : slug ? slug : "";
	let submitValue;

	let sending = false;
	let logs = [];

	let title;
	let action;
	let dialog;
	let tip;

	if (isType === "addPartner") {
		title = 'Partner toevoegen';
		action = '/';
		tip = 'Voeg een bestaande website toe.';
		submitValue = "Toevoegen";
	} else if (isType === "editPartner") {
		title = 'Partner bewerken';
		action = '?/editPartner';
		tip = null;
		submitValue = "Bewerken";
	} else if (isType === "deletePartner") {
		title = 'Partner verwijderen';
		action = '?/deletePartner';
		tip = 'Deze partner wordt permanent verwijderd.';
		submitValue = "Verwijderen";
	} else if (isType === "addUrl") {
		title = 'Url toevoegen';
		action = '?/addUrl';
		tip = 'Voeg een bestaande url toe.';
		submitValue = "Toevoegen";
	} else if (isType === "editUrl") {
		title = 'Url bewerken';
		action = '?/editPost';
		tip = null;
		submitValue = "Bewerken";
	} else if (isType === "deleteUrl") {
		title = 'Url verwijderen';
		action = '?/deletePost';
		tip = 'Deze url wordt permanent verwijderd.';
		submitValue = "Verwijderen";
	} else {
		console.log('Geen type opgegeven');
	}

	export function open() {
		dialog.showModal();
	}

	function close(event) {
		event.preventDefault();
		dialog.close();
	}

	function closeTip() {
		const tipMessage = document.querySelector('.tip-message');
		tipMessage.remove();
	}

	async function submitHandling(event) {
		// prevent default form submission
		event.preventDefault();

		// start loading animation
		sending = true;

		logs = [];

		// handle form submission
		const formData = new FormData(event.target);

		const postRes = await fetch(action, {
			method: 'POST',
			body: formData
		});

		if (isType === "addPartner" || isType === "editPartner") {
			if (!postRes.ok) {
				console.error('POST-fout', postRes.status);
				sending = false;
				return;
			}

			// Check if the response is a stream
			if (!postRes.body) {
				console.error('Geen stream ontvangen');
				sending = false;
				return;
			}

			// Stream reading
			const reader = postRes.body.getReader();
			const decoder = new TextDecoder();
			let buffer = '';
			let done = false;

			while (!done) {
				const { value, done: streamDone } = await reader.read();
				if (streamDone) break;

				buffer += decoder.decode(value, { stream: true });
				const parts = buffer.split('\n\n');
				buffer = parts.pop();

				for (const part of parts) {
					if (!part.startsWith('data:')) continue;
					const { status, type, error } = JSON.parse(part.replace(/^data:\s*/, ''));
					if (error) {
						logs = [...logs, { status: error, type: 'error' }];
					} else {
						logs = [...logs, { status, type }];
					}

					if (status === 'Alle urls zijn toegevoegd') {
						done = true;
						break;
					}
				}
			}
		}

		sending = false;
		dialog.close();
		window.location.reload();
	}
</script>

<dialog bind:this={dialog}>
	<section class="form-container">
		<h2>{title}</h2>

		{#if !sending}
		{#if tip !== null}
		<div class="tip-message" aria-label="tip message">
			<p>{tip}</p>
			<button on:click={closeTip}>
				<img src="/icons/close.svg" width="24" height="24" alt="sluit" />
			</button>
		</div>
		{/if}

		<form on:submit|preventDefault={submitHandling}>
			{#if isType === "addPartner" || isType === "editPartner" || isType === "addUrl" || isType === "editUrl"}
			<div class="input-container">
				<label for="name">Naam</label>
				<input id="name" name="name" type="text" required placeholder="type een titel..." bind:value={nameValue} />
			</div>

			<div class="input-container">
				<label for="url">Url</label>
				<input id="url" name="url" type="url" required placeholder="type een url link..." bind:value={urlValue} />
			</div>
			{/if}

			{#if isType === "addUrl" || isType === "editUrl"}
				<div class="input-container">
					<label for="slug">Slug</label>
					<input id="slug" name="slug" value={slugValue} readonly />
				</div>
			{/if}

			{#if isType === "editPartner"}
				<div class="input-container">
					<label for="sitemap">Sitemap ophalen</label>
					<input id="sitemap" name="sitemap" type="checkbox" />
				</div>
			{/if}

			{#if isType === "deleteUrl" || isType === "deletePartner"}
			<div class="input-container">
				<label for="name">Naam</label>
				<input id="name" name="name" type="text" readonly bind:value={nameValue} />
			</div>

			<div class="input-container">
				<label for="url">Url</label>
				<input id="url" name="url" type="url" readonly bind:value={urlValue} />
			</div>
			{/if}

			<div class="button-div">
				<button type="submit" class="add-button">{submitValue}</button>
				<button class="remove-button" on:click={close}>Sluiten</button>
			</div>
		</form>
		{/if}

		{#if sending}
			<div class="tip-message" aria-label="tip message">
				<p><span>{name}</span> wordt opgehaald en toegevoegd...</p>
			</div>
			<Loader itemArray={logs} />
		{/if}
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
		background-color: rgba(44, 44, 44, 0.75);
		backdrop-filter: blur(0.5rem);
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
		padding-bottom: 0.5rem;
		color: var(--c-white);
	}

	.tip-message {
		background-color: var(--c-container-stroke);
		display: flex;
		flex-direction: row;
		align-items: center;
		border-radius: 0.25rem;
		overflow: hidden;
		width: 100%;
		padding: 0.5rem 1rem;
		position: relative;
	}

	.tip-message::before {
		content: '!';
		width: 2rem;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: var(--c-orange);
		color: var(--c-white);
		font-weight: 600;
		padding: 0.25rem;
		position: absolute;
		left: 0;
	}

	.tip-message p {
		color: var(--c-white);
		margin-left: 2rem;
		width: 100%;
	}

	.tip-message button {
		background: none;
		width: 1rem;
		height: 1rem;
		padding: 1rem;
	}

	form {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
		width: 100%;
	}

	.input-container {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 1rem;
		margin-bottom: 1rem;
		width: 100%;
		border-radius: 0.25rem;
	}

	label {
		color: var(--c-white);
		padding: 0.5rem 1rem;
		border-radius: 0.25rem;
		text-align: center;
		width: 5rem;
	}

	input {
		width: 100%;
		padding: 0.5rem 1rem;
		display: inline-block;
		border-radius: 0.25rem;
		font-size: 1rem;
		border: none;
	}

	input:focus,
	button:focus {
		outline: 0.1rem solid var(--c-orange);
	}

	input:read-only {
		background-color: var(--c-container-stroke);
		color: var(--c-white);
	}

	input:invalid {
		outline: 0.1rem solid red;
	}

	input:valid {
		outline: 0.1rem solid limegreen;
	}

	.button-div {
		display: flex;
		flex-direction: row;
		gap: 1rem;
		width: 100%;
	}

	button {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
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

	.add-button:before,
	.remove-button::before {
		content: '';
		display: inline-block;
		width: 1rem;
		height: 1rem;
		background-position: center;
		background-size: contain;
		background-repeat: no-repeat;
		margin-right: 0.5rem;
	}

	.add-button::before {
		background-image: url('/icons/send.svg');
	}

	.remove-button::before {
		background-image: url('/icons/close.svg');
	}

	.add-button:hover {
		opacity: 0.75;
	}

	.remove-button:hover {
		opacity: 0.75;
	}

	span {
		display: contents;
		color: var(--c-pink);
		font-weight: 900;
		text-transform: uppercase;
	}
</style>
