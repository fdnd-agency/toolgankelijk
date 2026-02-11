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
<dialog open bind:this={dialog}>
    <section class="color-primary-light">
        <div class="form-heading">
            <h2>Voeg {title} toe</h2>
            <button class="add-form-cross" on:click={close}>
                <img src="/icons/cross-icon.svg" width="32" height="32" alt="close form">
            </button>
        </div>

        <div>



        </div>


            <form on:submit|preventDefault={submitHandling}>
				<input type="hidden" value={idValue} name="id" />

				{#if !sending}
					{#if tip !== null}
            	<!-- exclmation mark -->
					<div class="form-message-tip">
						<img src="/icons/exclamation-icon.svg" width="32" height="32">
						<p> {tip} {#if tip!==null} geen bericht om te weergeven {/if} </p>

						<button on:click={closeTip}>
							<img src="/icons/cross-icon.svg" width="32" height="32">
						</button>
					</div>
				        {/if}
        			{/if}

				<div class="form-inputfields">
					<input type="text" placeholder="type in title">

					<input type="text" placeholder="type in url">
				</div>

				<div class="form-checkbox">
					<input type="checkbox" id="sitemap" name="Include sitemap">
					<label> Wilt u de sitemap erbij gebruiken?</label>
				</div>


                <button class="form-submit-button">Partner toevoegen</button>
            </form>
    </section>
</dialog>

<style>
	dialog {
		width: 100vw;
		height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
		overflow: visible;
		top: 0;
		border: none;
	}

	dialog::backdrop {
		background-color: rgba(44, 44, 44, 0.75);
		backdrop-filter: blur(0.5rem);
	}

	section {
		background-color: var(--color);
		height: 30vh;
		width: 35vw;
		height: 50vh;
		border-radius: 12px;
		padding-left: 2%;
		padding-right: 2%;

		@media (max-width: 720px){
			height: 50vh;
			width: 75vw;
			font-size: 12px;
		}
	}

    .form-heading {
        margin: 1em;
		display: flex;
		justify-content: space-between;
		color: var(--color-neutral-black);

		button, input[type="submit"], input[type="reset"] {
			background: none;
			color: inherit;
			border: none;
			padding: 0;
			font: inherit;
			cursor: pointer;
			outline: inherit;
		}
	}

	.form-message-tip {
		display: flex;
		height: 48px;
		justify-content: space-between;
		padding: 1em;
		background-color: var(--dark-2);
		border-radius: var(--border-radius);
		align-items: center;
		margin-bottom: 1em;

		@media (max-width: 720px){
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
			outline: inherit;
		}
	}

	.form-inputfields {
		display: flex;
		flex-direction: column;
		gap: 1em;
	}

	.form-submit-button {
		width: 100%;
		border: 1px var(--color-neutral-black) solid;
		filter: drop-shadow(var(--color-neutral-black) 2px 2px 4px);
	}

	.form-checkbox {
		padding: 1em;
	}
</style>