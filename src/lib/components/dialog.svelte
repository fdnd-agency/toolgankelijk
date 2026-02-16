<script>
	import Loader from '$lib/components/loader.svelte';

	// icons
	import ExclamationmarkIcon from './icons/exclamationmarkIcon.svelte';
	import CrossIcon from './icons/crossIcon.svelte';
	import EditIcon from './icons/editIcon.svelte';
	import DeleteIcon from './icons/deleteIcon.svelte';
	import AuditIcon from './icons/auditIcon.svelte';


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
		const tipMessage = document.querySelector('.form-message-tip');
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
    <section class="color-primary-light">
		{#if !sending}

		<div class="form-heading">
			<h2 class="form-heading">{title}</h2>
			<button class="form-close-button" onclick={close} aria-label="sluit het venster">
				<CrossIcon />
			</button>
		</div>

		{#if tip !== null}
			<div class="form-message-tip">
				<div class="form-exclamation-mark">
					<ExclamationmarkIcon />				
				</div>

				<p tabindex="0"> {tip} </p>
				<button onclick={closeTip} class="form-close-button" aria-label="sluit de tip">
					<CrossIcon />
				</button>
			</div>
							
		{/if}

		<form onsubmit={submitHandling} >
			<input type="hidden" value={idValue} name="id" />

				
				<!-- here comes the content of the section -->
				{#if isType === 'addUrl' || isType === 'addPartner'}
				<div class="form-textfields">
				<label>Typ hier je titel</label>
					<input 
					name="name"
					id="name"
					type="text" 
					required
					placeholder="Typ hier je titel"
					autocomplete="given-name"
					bind:value={nameValue}>

				<label>Typ hier je URL</label>
					<input 
					name="url"
					id="url"
					type="text" 
					required
					placeholder="Typ hier je URL link"
					bind:value={urlValue}
					>
				</div>
				<div class="form-checkbox">
					<input id="sitemap" name="sitemap" type="checkbox" />
					<label for="sitemap">Sitemap ophalen van deze partner?</label>
				</div>
				{/if}

				{#if isType === 'editUrl' || isType === 'editPartner'}
				<div class="form-edit-textfields">
					<div class="form-edit-icon">
						<EditIcon/>
					</div>
					<div class="form-edit-textfields">
				<label>Typ hier je titel</label>
					<input 
					name="name"
					id="name"
					type="text" 
					required
					placeholder="Typ hier je titel"
					bind:value={nameValue}>

					<div class="form-edit-icon">
						<EditIcon/>
					</div>
				<label>Typ hier je URL</label>
					<input 
					name="url"
					id="url"
					type="text" 
					required
					placeholder="Typ hier je URL link"
					bind:value={urlValue}
					>
				</div>
				</div>
				<div class="form-checkbox">
					<input id="sitemap" name="sitemap" type="checkbox" />
					<label for="sitemap">Sitemap ophalen van deze partner?</label>
				</div>

				{/if}

				{#if isType === 'addUrl' || isType === 'editUrl' || isType === 'editPartner'}
					<input type="hidden" id="slug" name="slug" value={slugValue} readonly />
				{/if}


				{#if isType === 'deleteUrl' || isType === 'deletePartner'}
				
				
				<div class="form-delete-fields" tabindex="0">
					<h2>{nameValue}</h2>
					<h2>{urlValue}</h2>
				</div>
				
				<div class="form-delete-content" tabindex="0">
					<DeleteIcon />
					<p>Weet je zeker dat je {title} wilt verwijderen?</p>
				</div>
				{/if}

				{#if isType === 'startAudit' }
					<AuditIcon />
					<p>Wilt u een audit uitvoeren?</p>

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
					
			<button class="form-submit-button" aria-label="verzend formulier">
				<!-- here comes all the is states of submitting -->
					{submitValue}
			</button>
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
		width: 100%;
		min-width: 0em;
		max-width: 0em;

		overflow: visible;
		transform: translate(-50%, -50%);
		top: 0;
		border: none;
		display: none;
		top: 45%;
		left: 32%;

		@media (max-width: 1400px){
			left: 25%;
		}

		@media (max-width: 1080px){
			left: 19%;
		}

		@media (max-width: 720px){
			left: 11%;
		}
	}

	@media (max-width: 1080px) {
	.dialog-title {
		font-size: 28px;
		} 
	}

	@media (max-width: 720px) {
	.dialog-title {
		font-size: 24px;
		} 
	}

	dialog[open] {
		display: block;
	}

	dialog::backdrop {
		background-color: rgba(44, 44, 44, 0.75);
		backdrop-filter: blur(0.5rem);
	}

	section {
		background-color: var(--color);
		color: var(--color-neutral-black);
		height: 30vh;
		width: 35vw;
		height: fit-content;
		border-radius: 12px;
		padding: 2em;

		@media (max-width: 1400px){
			width: 55vw;
		}

		@media (max-width: 1080px){
			width: 60vw;
		}

		@media (max-width: 720px){
			width: 75vw;
		}
	}

    .form-heading {
		display: flex;
		justify-content: space-between;
		color: var(--color-neutral-black);
	}

	.form-heading button,
	.form-heading input[type="submit"],	
	.form-heading input[type="reset"] {
			background: none;
			color: inherit;
			border: none;
			padding: 0;
			font: inherit;
			cursor: pointer;
	}

	.form-heading button:focus {
			border: black solid 1px;
	}

	@media (max-width: 720px){
		.form-heading {
			font-size: 16px;
		}
	}

	.form-message-tip {
		display: flex;
		height: 48px;
		justify-content: space-between;
		padding: 1em;
		color: var(--color-neutral-black);
		background-color: var(--dark-2);
		border-radius: var(--border-radius);
		align-items: center;
		margin-bottom: 1em;

		@media screen and (max-width: 720px){
			height: 32px;
			font-size: 12px;
		}

		button, input[type="submit"], input[type="reset"] {
			background: none;
			color: inherit;
			border: none;
			padding: 0;
			font: inherit;
			cursor: pointer;
		}
	}

	.form-submit-button {
		width: 100%;
		margin-top: 1em;
		border: 1px var(--color-neutral-black) solid;
		color: var(--color-neutral-black);
		background-color: var(--dark-3);
		filter: drop-shadow(var(--color-neutral-black) 2px 2px 4px);
	}

	.form-textfields {
		display: flex;
		flex-direction: column;
		gap: 1em;

		label {
			display: none;
		}
	}

	.form-checkbox {
		padding: 1em;
	}

	.form-edit-icon {
		position: relative;
		top: 2.7em;
		width: 2em;
		left: 91%;
		opacity: 0.5;
		pointer-events: none;

		@media (max-width: 720px){
			top: 1.8em;
			left: 92%;
		}
	}

	.form-edit-textfields {
		label {
			display: none;
		}
	}

	.form-delete-fields {
		display: flex;
		flex-direction: column;
		gap: 1em;

		h3 {
			background-color: var(--dark-3);
			color: var(--light-3);
			padding: 0.3em;
		}
	}

	.form-delete-content {
		display: flex;
		flex-direction: row;
		gap: 1em;
		padding: 1em;
	}
</style>