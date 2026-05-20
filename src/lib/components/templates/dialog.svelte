<script>
	import Icon from '../atoms/icon.svelte';
	import NavButton from '../molecules/navButton.svelte';
	import Loader from '../molecules/loader.svelte';

	let { params, isType, id = '', name = '', url = '', slug = '', website = {}, dialog } = $props();

	let formData = $state({
		id: id,
		name: name,
		url: url,
		slug: params || slug
	});

	let sending = $state(false);
	let showTip = $state(true);
	let logs = $state([]);
	let urlCount = $state(0);
	let urlTotal = $state(0);

	const typeConfig = {
		addPartner: {
			title: 'Partner toevoegen',
			action: '/api/addPartner',
			tip: 'Voeg een bestaande website toe.',
			btn: 'Toevoegen',
			type: 0
		},
		editPartner: {
			title: 'Partner bewerken',
			action: '/api/editPartner',
			tip: null,
			btn: 'Bewerken',
			type: 0
		},
		deletePartner: {
			title: 'Partner verwijderen',
			action: '/api/deletePartner',
			tip: 'Deze partner wordt permanent verwijderd.',
			btn: 'Verwijderen',
			type: 0
		},
		addUrl: {
			title: 'Url toevoegen',
			action: '/api/addUrl',
			tip: 'Voeg een bestaande url toe.',
			btn: 'Toevoegen',
			type: 0
		},
		editUrl: { title: 'Url bewerken', action: '/api/editUrl', tip: null, btn: 'Bewerken', type: 0 },
		deleteUrl: {
			title: 'Url verwijderen',
			action: '/api/deleteUrl',
			tip: 'Deze url wordt permanent verwijderd.',
			btn: 'Verwijderen',
			type: 0
		},
		startAudit: {
			title: 'Audit starten',
			action: '/api/startAudit',
			tip: null,
			btn: 'Starten',
			type: 1
		}
	};

	const config = $derived(typeConfig[isType] || {});

	const showTextFields = $derived(
		['addUrl', 'addPartner', 'editUrl', 'editPartner'].includes(isType)
	);
	const isEdit = $derived(isType === 'editUrl' || isType === 'editPartner');
	const isDelete = $derived(isType === 'deleteUrl' || isType === 'deletePartner');

	export function open() {
		dialog?.showModal();
		showTip = true;
	}

	function close(event) {
		event?.preventDefault();
		dialog?.close();
		document.body.style.overflowY = 'unset';
	}

	function splitSseDoubleNewlineFrames(buffer) {
		const frames = buffer.split('\n\n');
		const remainder = frames.pop() ?? '';
		return { frames, remainder };
	}

	function getFirstDataLineFromSseFrame(rawFrame) {
		const trimmed = rawFrame.trim();
		if (!trimmed) return null;
		return (
			trimmed
				.split('\n')
				.map((line) => line.trimEnd())
				.find((line) => line.startsWith('data:')) ?? null
		);
	}

	function parseSseJsonPayload(dataLine) {
		try {
			return JSON.parse(dataLine.replace(/^data:\s*/, ''));
		} catch {
			return null;
		}
	}

	async function handleFormSubmit(event) {
		event.preventDefault();
		sending = true;
		logs = [];
		urlCount = 0;
		urlTotal = 0;

		const postResponse = await fetch(config.action, {
			method: 'POST',
			body: new FormData(event.target)
		});

		if (!postResponse.ok || !postResponse.body) {
			console.error('Fetch error or no stream received');
			sending = false;
			return;
		}

		const reader = postResponse.body.getReader();
		const decoder = new TextDecoder();
		let buffer = '';
		let done = false;

		while (!done) {
			const { value, done: streamDone } = await reader.read();
			if (streamDone) break;

			buffer += decoder.decode(value, { stream: true });
			const { frames: completeFrames, remainder } = splitSseDoubleNewlineFrames(buffer);
			buffer = remainder;

			for (const rawFrame of completeFrames) {
				const dataLine = getFirstDataLineFromSseFrame(rawFrame);
				if (!dataLine) continue;

				const parsedPayload = parseSseJsonPayload(dataLine);
				if (!parsedPayload) continue;

				const { status, type, error, count, total } = parsedPayload;

				if (Number.isFinite(count) && Number.isFinite(total)) {
					urlCount = count;
					urlTotal = total;
				}

				if (error) {
					logs = [...logs, { status: error, type: 'error' }];
				} else {
					if (logs.length > 0 && logs[logs.length - 1].type === 'loading' && type !== 'loading') {
						logs = logs.filter((logEntry) => logEntry.type !== 'loading');
					}
					logs = [...logs, { status, type }];
				}

				if (status === 'Alle urls zijn toegevoegd') done = true;
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
				<h2 class="form-heading">{config.title}</h2>
				<NavButton
					onclick={close}
					aria="sluit het venster"
					variant="primary"
					showIcon={true}
					iconName="cross"
					effect="cross"
					size="small"
				></NavButton>
			</div>

			{#if config.tip && showTip}
				<div class="form-message-tip">
					<p>{config.tip}</p>
				</div>
			{/if}

			<form onsubmit={handleFormSubmit}>
				<input type="hidden" name="id" value={formData.id} />
				{#if isType === 'startAudit'}
					<input type="hidden" name="slug" value={website.slug ?? formData.slug} />
					<input
						type="hidden"
						name="urls"
						value={JSON.stringify(
							(website.urls ?? []).map((websiteUrlEntry) => ({
								url: websiteUrlEntry.url,
								urlSlug: websiteUrlEntry.slug
							}))
						)}
					/>
				{:else if showTextFields}
					<input type="hidden" name="slug" value={formData.slug} readonly />
				{/if}

				{#if showTextFields}
					<div class={isEdit ? 'form-edit-textfields' : 'form-textfields'}>
						{#if isEdit}
							<div class="form-edit-icon">
								<Icon iconName="edit" />
							</div>
						{/if}

						<label for="name">Typ hier je titel</label>
						<input
							name="name"
							id="name"
							type="text"
							required
							placeholder="Typ hier je titel"
							bind:value={formData.name}
						/>

						{#if isEdit}
							<div class="form-edit-icon">
								<Icon iconName="edit" />
							</div>
						{/if}

						<label for="url">Typ hier je URL</label>
						<input
							name="url"
							id="url"
							type="text"
							required
							placeholder="Typ hier je URL link"
							bind:value={formData.url}
						/>
					</div>

					<div class="form-checkbox">
						<input id="sitemap" name="sitemap" type="checkbox" />
						<label for="sitemap">Sitemap ophalen van deze partner?</label>
					</div>
				{/if}

				{#if isDelete}
					<div class="form-delete-content" tabindex="0">
						<Icon iconName="delete" />
						<p>
							Weet je zeker dat je {isType === 'deleteUrl' ? formData.url : formData.name} wilt verwijderen?
						</p>
					</div>
				{:else if isType === 'startAudit'}
					<div class="form-audit-content" tabindex="0">
						<Icon iconName="audit" />
						<p>
							Weet je zeker dat je een audit wilt starten voor {formData.name}?
						</p>
					</div>
				{/if}

				<NavButton aria="verzend formulier" variant="primary">
					{config.btn}
				</NavButton>
			</form>
		{:else}
			<div class="tip-message" aria-label="tip message">
				<p><span>{formData.name}</span> wordt verwerkt, sluit de pagina niet.</p>
			</div>
			<Loader logItems={logs} {urlCount} {urlTotal} type={config.type} />
		{/if}
	</section>
</dialog>

<style>
	dialog {
		width: 0em;
		overflow: visible;
		top: 0;
		border: none;
		display: none;
		left: 32%;
		top: 50%;
		transform: translate(-50%, -50%);

		@media (max-width: 1400px) {
			left: 25%;
		}

		@media (max-width: 1080px) {
			left: 19%;
		}

		@media (max-width: 720px) {
			left: 11%;
		}

		@media (max-height: 500px) {
			top: 8%;
		}
	}

	:global(.navbutton:focus) {
		transition: border-color 0.2s ease-in-out !important;
		border: transparent 2px solid !important;
	}

	:global(.navbutton:focus) {
		border-color: transparent !important;
	}

	:global(.navbutton:hover) {
		border-color: white !important;
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

		@media (max-width: 1400px) {
			width: 55vw;
		}

		@media (max-width: 1080px) {
			width: 60vw;
		}

		@media (max-width: 720px) {
			width: 75vw;
		}
	}

	.form-heading {
		display: flex;
		justify-content: space-between;
		color: var(--color-neutral-black);
	}

	@media (max-width: 720px) {
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

		@media screen and (max-width: 720px) {
			height: 32px;
			font-size: 12px;
		}
	}

	.form-textfields {
		display: flex;
		flex-direction: column;
		gap: 1em;

		label {
			display: none;
		}
	}

	.form-edit-textfields {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
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

		@media (max-width: 720px) {
			top: 1.8em;
			left: 92%;
		}
	}

	.form-edit-textfields {
		label {
			display: none;
		}
	}

	.form-audit-content {
		display: flex;
		flex-direction: row;
		gap: 1em;
		padding: 1em;
	}

	.form-delete-content {
		display: flex;
		flex-direction: row;
		gap: 1em;
		padding: 1em;
	}

	input[type='text'] {
		height: 48px;
		width: 100%;
		background-color: var(--color-neutral-white);
		color: var(--color-neutral-black);
		border: var(--color-neutral-black) 1px solid;
		border-radius: 12px;
		font-size: 16px;
		padding-left: 1em;

		@media (max-width: 720px) {
			height: 32px;
			font-size: 12px;
		}
	}
</style>
