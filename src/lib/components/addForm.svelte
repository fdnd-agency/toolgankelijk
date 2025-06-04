<script>
	import Loader from '$lib/components/loader.svelte';

	export let params;
	export let isType;
	export let id;
	export let name;
	export let url;
	export let slug;
	export let website;

	let idValue = id ? id : '';
	let nameValue = name ? name : '';
	let urlValue = url ? url : '';
	let slugValue = params ? params : slug ? slug : '';
	let submitValue;

	let sending = false;
	let logs = [];
	let urlCount = 0;
	let urlTotal = 0;
	let type = 0;

	let title;
	let action;
	let dialog;
	let tip;

	if (isType === 'addPartner') {
		title = 'Partner toevoegen';
		action = '/api/addPartner';
		tip = 'Voeg een bestaande website toe.';
		submitValue = 'Toevoegen';
	} else if (isType === 'editPartner') {
		title = 'Partner bewerken';
		action = '/api/editPartner';
		tip = null;
		submitValue = 'Bewerken';
	} else if (isType === 'deletePartner') {
		title = 'Partner verwijderen';
		action = '/api/deletePartner';
		tip = 'Deze partner wordt permanent verwijderd.';
		submitValue = 'Verwijderen';
	} else if (isType === 'addUrl') {
		title = 'Url toevoegen';
		action = '/api/addUrl';
		tip = 'Voeg een bestaande url toe.';
		submitValue = 'Toevoegen';
	} else if (isType === 'editUrl') {
		title = 'Url bewerken';
		action = '/api/editUrl';
		tip = null;
		submitValue = 'Bewerken';
	} else if (isType === 'deleteUrl') {
		title = 'Url verwijderen';
		action = '/api/deleteUrl';
		tip = 'Deze url wordt permanent verwijderd.';
		submitValue = 'Verwijderen';
	} else if (isType === 'startAudit') {
		title = 'Audit starten';
		action = '/api/startAudit';
		tip = null;
		submitValue = 'Starten';
		type = 1;
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
		urlCount = 0;
		urlTotal = 0;

		// handle form submission
		const formData = new FormData(event.target);

		const postRes = await fetch(action, {
			method: 'POST',
			body: formData
		});

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
				const { status, type, error, count, total } = JSON.parse(part.replace(/^data:\s*/, ''));
				if (count && total) {
					urlCount = count;
					urlTotal = total;
				}
				if (error) {
					logs = [...logs, { status: error, type: 'error' }];
				} else {
					if (logs.length > 0 && logs[logs.length - 1].type === 'loading' && type !== 'loading') {
						logs = logs.filter((log) => log.type !== 'loading');
					}
					logs = [...logs, { status, type }];
				}

				if (status === 'Alle urls zijn toegevoegd') {
					done = true;
					break;
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
				<input type="hidden" value={idValue} name="id" />

				{#if isType === 'addPartner' || isType === 'editPartner' || isType === 'addUrl' || isType === 'editUrl'}
					<div class="input-container">
						<label for="name">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								class="icon icon-tabler icons-tabler-outline icon-tabler-world"
								><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path
									d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"
								/><path d="M3.6 9h16.8" /><path d="M3.6 15h16.8" /><path
									d="M11.5 3a17 17 0 0 0 0 18"
								/><path d="M12.5 3a17 17 0 0 1 0 18" /></svg
							>
							Naam
						</label>
						<input
							id="name"
							name="name"
							type="text"
							required
							placeholder="type een titel..."
							bind:value={nameValue}
						/>
					</div>

					<div class="input-container">
						<label for="url">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								class="icon icon-tabler icons-tabler-outline icon-tabler-link"
								><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M9 15l6 -6" /><path
									d="M11 6l.463 -.536a5 5 0 0 1 7.071 7.072l-.534 .464"
								/><path
									d="M13 18l-.397 .534a5.068 5.068 0 0 1 -7.127 0a4.972 4.972 0 0 1 0 -7.071l.524 -.463"
								/></svg
							>
							Url
						</label>
						<input
							id="url"
							name="url"
							type="url"
							required
							placeholder="type een url link..."
							bind:value={urlValue}
						/>
					</div>
				{/if}

				{#if isType === 'addUrl' || isType === 'editUrl' || isType === 'editPartner'}
					<input type="hidden" id="slug" name="slug" value={slugValue} readonly />
				{/if}

				{#if isType === 'editPartner' || isType === 'addPartner'}
					<div class="input-container sitemap-container">
						<input id="sitemap" name="sitemap" type="checkbox" />
						<label for="sitemap">Sitemap ophalen van deze partner?</label>
					</div>
				{/if}

				{#if isType === 'deleteUrl' || isType === 'deletePartner'}
					<div class="input-container">
						<label for="name">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								class="icon icon-tabler icons-tabler-outline icon-tabler-world"
								><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path
									d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"
								/><path d="M3.6 9h16.8" /><path d="M3.6 15h16.8" /><path
									d="M11.5 3a17 17 0 0 0 0 18"
								/><path d="M12.5 3a17 17 0 0 1 0 18" /></svg
							>
							Naam
						</label>
						<input id="name" name="name" type="text" readonly bind:value={nameValue} />
					</div>

					<div class="input-container">
						<label for="url">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								class="icon icon-tabler icons-tabler-outline icon-tabler-link"
								><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M9 15l6 -6" /><path
									d="M11 6l.463 -.536a5 5 0 0 1 7.071 7.072l-.534 .464"
								/><path
									d="M13 18l-.397 .534a5.068 5.068 0 0 1 -7.127 0a4.972 4.972 0 0 1 0 -7.071l.524 -.463"
								/></svg
							>
							Url
						</label>
						<input id="url" name="url" type="url" readonly bind:value={urlValue} />
					</div>
				{/if}

				{#if isType === 'startAudit'}
					<p class="text-info">
						Weet je zeker dat je een audit wilt starten voor <span>{nameValue}</span>?
					</p>
					<input class="id-field" type="hidden" name="id" value={idValue} id={idValue} />
					<input
						type="hidden"
						name="urls"
						id="urls"
						value={JSON.stringify(
							website.urls?.map((item) => ({ url: item.url, urlSlug: item.slug }))
						)}
					/>
					<input type="hidden" name="slug" id="slug" value={slugValue} />
				{/if}

				<div class="button-div">
					<button type="submit" class="add-button">
						{#if isType === 'addPartner' || isType === 'addUrl'}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								class="icon icon-tabler icons-tabler-outline icon-tabler-plus"
								><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 5l0 14" /><path
									d="M5 12l14 0"
								/></svg
							>
						{:else if isType === 'editPartner' || isType === 'editUrl'}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								class="icon icon-tabler icons-tabler-outline icon-tabler-pencil"
								><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path
									d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4"
								/><path d="M13.5 6.5l4 4" /></svg
							>
						{:else if isType === 'deletePartner' || isType === 'deleteUrl'}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								class="icon icon-tabler icons-tabler-outline icon-tabler-trash"
								><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 7l16 0" /><path
									d="M10 11l0 6"
								/><path d="M14 11l0 6" /><path
									d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"
								/><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg
							>
						{:else if isType === 'startAudit'}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="currentColor"
								class="icon icon-tabler icons-tabler-filled icon-tabler-player-play"
								><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path
									d="M6 4v16a1 1 0 0 0 1.524 .852l13 -8a1 1 0 0 0 0 -1.704l-13 -8a1 1 0 0 0 -1.524 .852z"
								/></svg
							>
						{/if}
						{submitValue}
					</button>
					<button class="remove-button" on:click={close}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="currentColor"
							class="icon icon-tabler icons-tabler-filled icon-tabler-square-x"
							><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path
								d="M19 2h-14a3 3 0 0 0 -3 3v14a3 3 0 0 0 3 3h14a3 3 0 0 0 3 -3v-14a3 3 0 0 0 -3 -3zm-9.387 6.21l.094 .083l2.293 2.292l2.293 -2.292a1 1 0 0 1 1.497 1.32l-.083 .094l-2.292 2.293l2.292 2.293a1 1 0 0 1 -1.32 1.497l-.094 -.083l-2.293 -2.292l-2.293 2.292a1 1 0 0 1 -1.497 -1.32l.083 -.094l2.292 -2.293l-2.292 -2.293a1 1 0 0 1 1.32 -1.497z"
							/></svg
						>
						Sluiten
					</button>
				</div>
			</form>
		{/if}

		{#if sending}
			<div class="tip-message" aria-label="tip message">
				<p><span>{nameValue}</span> wordt verwerkt, sluit de pagina niet.</p>
			</div>
			<Loader itemArray={logs} {urlCount} {urlTotal} {type} />
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
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		margin-bottom: 1rem;
		width: 100%;
	}

	.sitemap-container {
		flex-direction: row;
	}

	.input-container svg {
		fill: transparent;
		stroke: var(--c-pink);
	}

	label {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 0.5rem;
		padding: 0;
		color: var(--c-white);
		border-radius: 0.25rem;
		width: 100%;
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

	input:user-invalid {
		outline: 0.1rem solid red;
	}

	input:user-valid {
		outline: 0.1rem solid limegreen;
	}

	input[type='checkbox'] {
		-webkit-appearance: none;
		appearance: none;
		background-color: var(--c-white);
		width: 1.5rem;
		height: 1.5rem;
		border-radius: 0.25rem;
		padding: 0;
		transform: translateY(-0.075rem);
		display: grid;
		place-content: center;
	}

	input[type='checkbox']::before {
		content: '';
		width: 1rem;
		height: 1rem;
		clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
		transform: scale(0);
		transform-origin: bottom left;
		transition: 120ms transform ease-in-out;
		background-color: var(--c-pink);
	}

	input[type='checkbox']:checked::before {
		transform: scale(1);
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

	.add-button svg,
	.remove-button svg {
		margin-right: 0.5rem;
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

	.text-info {
		color: var(--c-white);
		margin-bottom: 1rem;
	}
</style>
