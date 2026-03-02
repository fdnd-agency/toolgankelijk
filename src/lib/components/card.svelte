<script>
	import { onMount } from 'svelte';
	import Dialog from '$lib/components/dialog.svelte';
	import AuditIcon from '$lib/components/icons/auditIcon.svelte';
	import DeleteIcon from '$lib/components/icons/deleteIcon.svelte';
	import EditIcon from '$lib/components/icons/editIcon.svelte';

	export let website;
	export let principes;
	export let params;
	export let isUrl = false;

	let editType;
	let deleteType;
	let auditType;
	let dialogRefEdit;
	let dialogRefDelete;
	let dialogRefAudit;

	let labelValue;
	let progressbar;
	let lastTime;
	let link;
	let title;
	let url;
	let websiteCriteria;
	let totaalCriteria;
	let containerOff = false;
	const updatedTime = new Date(website.updatedAt);
	const currentTime = new Date();
	const timeDifference = Math.floor((currentTime - updatedTime) / (60 * 1000)); // Verschil in minuten
	const faviconAPI =
		'https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=';

	if (isUrl) {
		// show url
		link = params + '/' + website.slug;
		url = website.url;
		title = website.name;
		editType = 'editUrl';
		deleteType = 'deleteUrl';
	} else {
		// show website
		link = website.slug + '?partner=' + website.slug;
		url = website.homepage;
		title = website.titel;
		editType = 'editPartner';
		deleteType = 'deletePartner';
		auditType = 'startAudit';
	}

	if (timeDifference >= 60) {
		let minutes = timeDifference % 60;
		let hours = Math.floor(timeDifference / 60);
		let days = Math.floor(hours / 24);
		let years = Math.floor(days / 365);

		if (years > 0) {
			lastTime = `${years} jaar geleden`;
		} else if (years == 0 && days > 0) {
			lastTime = days <= 1 ? `${days} dag geleden` : `${days} dagen geleden`;
		} else {
			lastTime = `${hours} uur en ${minutes} min geleden`;
		}
	} else {
		lastTime = timeDifference > 0 ? `${timeDifference} min geleden` : 'Zojuist';
	}

	function openForm(type, event) {
		event.preventDefault();
		if (type === editType) {
			dialogRefEdit.open();
		} else if (type === deleteType) {
			dialogRefDelete.open();
		} else if (type === auditType) {
			dialogRefAudit.open();
		}
		document.body.style.overflowY = 'hidden';
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	onMount(() => {
		if (isUrl) {
			websiteCriteria = website.checks.reduce((total, check) => {
				total += check.succescriteria.length;
				return total;
			}, 0);

			totaalCriteria =
				principes.reduce((total, principe) => {
					principe.richtlijnen.forEach((richtlijn) => {
						total += richtlijn.succescriteria.length;
					});
					return total;
				}, 0) * website.checks.length;
		} else {
			websiteCriteria = website.urls.reduce((total, url) => {
				url.checks.forEach((check) => {
					total += check.succescriteria.length;
				});
				return total;
			}, 0);

			totaalCriteria =
				principes.reduce((total, principe) => {
					principe.richtlijnen.forEach((richtlijn) => {
						total += richtlijn.succescriteria.length;
					});
					return total;
				}, 0) * website.urls.length;
		}

		let percentage = Math.round((websiteCriteria / totaalCriteria) * 100);
		if (isNaN(percentage)) {
			percentage = 0;
		}
		progressbar.value = websiteCriteria;
		progressbar.max = totaalCriteria;
		labelValue.innerHTML = `${percentage}%`;
	});
</script>


<li class="color-primary-light" class:container-off={containerOff}>
	<section>
		{#if !isUrl}
			<picture class="card-partner-logo">
				<!-- picture -->
				<img
					class="partner-logo"
					width="256"
					height="256"
					src={faviconAPI + url + '/&size=128'}
					alt="logo partner"
				/>
			</picture>
		{/if}

		{#if !isUrl}
			<h2 class="name">{title}</h2>
		{/if}

		{#if isUrl}
			<h2 class="card-url" style="grid-row:1/2; grid-column:1/4;">{url}</h2>
		{/if}

		{#if isUrl}
		<div id="url-progress-container" class="color-primary">
			<progress id="progress-partner" max="100" value="0" bind:this={progressbar}> </progress>
			<label class="progress-percentage" for="progress-partner" bind:this={labelValue}>0%</label>
		</div>
		{/if}

		{#if !isUrl}
		<div id="partner-progress-container" class="color-primary">
			<progress id="progress-partner" max="100" value="0" bind:this={progressbar}></progress>
			<label class="progress-percentage" for="progress-partner" bind:this={labelValue}>0%</label>
		</div>
		{/if}

		<div class="card-icons">
		{#if !isUrl}
			<button
				onclick={openForm.bind(null, auditType)}
				aria-label="start icoon"
			>
				<div>
					<AuditIcon />
				</div>
			</button>

		{/if}

			<button onclick={openForm.bind(null, editType)} 
				aria-label="bewerk icoon">
					<div>
						<EditIcon />
					</div>
			</button>

			<button 
				onclick={openForm.bind(null, deleteType)} 
				aria-label="verwijder icoon"
				>
					<div>
						<DeleteIcon />
					</div>
				</button>


		</div>
				<button class="card-open">
					<a href={link}>Open</a>
				</button>
	</section>
</li>

<Dialog
	bind:this={dialogRefEdit}
	isType={editType}
	id={website.id}
	name={title}
	{url}
	slug={website.slug}
	{website}
/>
<Dialog
	bind:this={dialogRefDelete}
	isType={deleteType}
	id={website.id}
	name={title}
	{url}
	slug={website.slug}
	{website}
/>
<Dialog
	bind:this={dialogRefAudit}
	isType={auditType}
	id={website.id}
	name={title}
	{url}
	slug={website.slug}
	{website}
/>

<style>
	li {
		display: flex;
 		container-type: inline-size;
  		container-name: card-component;
	}

	li section {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		text-decoration: none;
		background-color: var(--light-1);
		padding: 1em;
		border-radius: var(--border-radius);
		width: 100%;
		transition: 0.25s ease;
		background: linear-gradient(0.25turn,var(--light-2), var(--dark-1));
		display: grid;
		grid-template-columns: 1fr 60%;
		grid-template-rows: 1fr 20% 20%;
		opacity: 0.8;
	}

	li section:hover {
		opacity: 1;
		animation-duration: 0.2s;
	}

	h2 {
		font-size: 36px;
		max-width: 20ch;
		overflow: hidden;
		text-overflow: ellipsis;
		color: var(--color-neutral-black);
		grid-column-start: 2;
		margin-left: 0.5em;
	}

	.card-url {
		grid-column-start: 1;
	}

	.card-partner-logo {
		border-radius: var(--border-radius);
		overflow: hidden;
		grid-row: 1/4;
		object-fit: fill;
		width: fit-content;
		height: fit-content;
	}

	section button {
		background: none;
		cursor: pointer;
		border: none;
		border-radius: var(--border-radius);
		background-color: var(--dark-3);
		border: var(--color-neutral-black) solid 1px;
		height: 32px;
		width: 32px;
		display: flex;
		align-items: center;
		justify-content: center;

		div {
			scale: 0.5;
		}

		&:hover {
			filter: drop-shadow(var(--color-neutral-black) 2px 2px 4px);
			animation-duration: 0.2s;
			background-color: var(--light-3);
			color: var(--color-neutral-black);
		}
	}

	#partner-progress-container {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		align-items: flex-end;
		gap: 1rem;
		margin-top: 0.25rem;
		grid-row-start: 2;
		grid-column-start: 2;
		margin: 1em;

		label {
			color: var(--color-neutral-black);
		}
	}

	#url-progress-container {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		align-items: flex-end;
		gap: 1rem;
		margin-top: 0.25rem;
		grid-row-start: 2;
		grid-column: 1/3;
		margin: 1em;
		
		label {
			color: var(--color-neutral-black);
		}
	}

	progress {
		width: 100%;
		border-radius: 0.5rem;
		background-color: var(--color-neutral-lightgrey);
		border: none;
		overflow: hidden;
	}

	progress[value] {
		-webkit-appearance: none;
		appearance: none;
	}

	progress[value]::-webkit-progress-bar {
		background-color: var(--color-neutral-lightgrey);
		border-radius: 0.5rem;
	}

	progress[value]::-webkit-progress-value {
		background-color: var(--color);
		border-radius: 0.5rem;
		transition: 1s ease-out;
	}

	progress[value]::-moz-progress-bar {
		background-color: var(--color-neutral-lightgrey);
		border-radius: 0.5rem;
		transition: 1s ease-out;
	}

	.progress-percentage {
		height: 85%;
	}

	.container-off {
		display: none;
	}

	.card-open {
		border-radius: var(--border-radius);
		background-color: var(--dark-3);
		border: var(--color-neutral-black) solid 1px;
		width: 12em;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 32px;
		grid-column: 2/3;
		grid-row: 3/4;
		margin-left: 2em;
		margin-top: 0.8em;
		padding: 1.6em;

		&:hover {
			filter: drop-shadow(var(--color-neutral-black) 2px 2px 4px);
			animation-duration: 0.2s;
		}


		a {
			text-decoration: none;
			font-size: 18px;
			font-weight: 800;
			color: var(--color-neutral-black);
		}

		@media (max-width: 720px) {
			height: 32px;
			font-size: 12px;
		}
	}

	.card-icons {
		grid-row-start: 3;
		grid-column-start: 2;
		display: flex;
		justify-content: flex-end;
		gap: 0.5em;
		align-items: center;
		margin-right: 1em;
	}

	@container card-component (width < 600px) {
		li section {
			grid-template-rows: 50% 1fr 1fr 1fr;
			grid-template-columns: 1fr;
			height: fit-content;
		}


		h2 {
			grid-row: 1/2;
			grid-column: 2/3;
			margin-top: 1em;
			display: flex;
			align-items: flex-end;
		}

		#url-progress-container, #partner-progress-container {
			grid-row: 3/3;
			grid-column: 1/3;
		}

		.card-partner-logo {
			grid-column: 1/3;
			grid-row: 1/1;
			width: auto;
			height: auto;
		}

		.card-open {
			grid-column: 1/2;
			grid-row: 5/5;
			margin-bottom: 1em;
		}

		.card-icons {
			grid-row: 5/5;
		}

	}

		@container card-component (width < 400px) {
			h2 {
				grid-column: 1/2;
				grid-row: 1/2;
			}
		}
</style>
