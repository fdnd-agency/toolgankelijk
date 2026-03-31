<script>
	import { onMount } from 'svelte';
	import Dialog from '$lib/components/dialog.svelte';
	import NavButton from '$lib/components/NavButton.svelte';

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



{#if !isUrl}
	<div class="card-wrapper">
		<article class="color-primary-light" id="card-partner" class:container-off={containerOff}>
			{#if !isUrl}
				<picture class="card-partner-logo" fetchpriority="high">
					<!-- picture -->
					<img
						class="partner-logo"
						width="256"
						height="256"
						src={faviconAPI + url + '/&size=128'}
						alt="logo van {title}"
					/>
				</picture>
			{/if}

			{#if !isUrl}
				<h2 class="card-title">{title}</h2>
			{/if}

			{#if isUrl}
				<h2 class="card-title-url">{url}</h2>
			{/if}

			{#if isUrl}
				<div id="url-progress-container" class="color-primary">
					<progress id="progress-partner" max="100" value="0" bind:this={progressbar}> </progress>
					<label class="progress-percentage" for="progress-partner" bind:this={labelValue}>0%</label
					>
				</div>
			{/if}

			{#if !isUrl}
				<div id="partner-progress-container" class="color-primary">
					<progress id="progress-partner" max="100" value="0" bind:this={progressbar}></progress>
					<label class="progress-percentage" for="progress-partner" bind:this={labelValue}>0%</label
					>
				</div>
			{/if}

			<div class="card-icons-partner">
				{#if !isUrl}	
				<NavButton onclick={openForm.bind(null, auditType)} aria="start audit van {title}" size="small" variant="secondary" showIcon={true} 
    			iconName="audit"></NavButton>


				{/if}

				<NavButton onclick={openForm.bind(null, editType)}
					aria={isUrl ? `bewerk ${url}` : `bewerk ${title}`} size="small" variant="secondary" showIcon={true} 
    iconName="edit"></NavButton>

				<NavButton onclick={openForm.bind(null, deleteType)} aria={isUrl ? `verwijder ${url}` : `verwijder ${title}`} size="small" variant="secondary" showIcon={true} 
    iconName="delete"></NavButton>

				<NavButton href={link} aria={isUrl ? `open ${url}` : `open ${title}`} size="medium" variant="secondary" showIcon={false} > Open</NavButton>
			</div>
		</article>
	</div>
{/if}

{#if isUrl}
	<div class="card-wrapper">
		<article id="card-url" class="color-primary-light" class:container-off={containerOff}>
			<h2 class="card-title-url">{url}</h2>

			<div id="url-progress-container" class="color-primary">
				<progress id="progress-partner" max="100" value="0" bind:this={progressbar}> </progress>
				<label class="progress-percentage" for="progress-partner" bind:this={labelValue}>0%</label>
			</div>

			<div class="card-icons-url">
					<NavButton onclick={openForm.bind(null, editType)}  aria="bewerk ${url}" size="small" variant="secondary" showIcon={true} 
    iconName="edit"></NavButton>

					<NavButton onclick={openForm.bind(null, deleteType)} aria="verwijder ${url}" size="small" variant="secondary" showIcon={true} 
    iconName="delete"></NavButton>

				<NavButton href={link} aria={isUrl ? `open ${url}` : `open ${title}`} size="medium" variant="secondary" showIcon={false} > Open</NavButton>
			</div>
		</article>
	</div>
{/if}

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
	.card-wrapper {
		display: flex;
		container-type: inline-size;
		container-name: card-component;
	}

	#card-partner {
		background-color: var(--light-1);
		padding: 1em;
		border-radius: var(--border-radius);
		width: 100%;
		transition: 0.25s ease;
		background: linear-gradient(0.25turn, var(--light-2), var(--dark-1));
		display: grid;
		grid-template-columns: 1fr 60%;
		grid-template-rows: 1fr 20% 20%;
		opacity: 0.8;
	}

	#card-url {
		background-color: var(--light-1);
		padding: 1em;
		border-radius: var(--border-radius);
		width: 100%;
		transition: 0.25s ease;
		background: linear-gradient(0.25turn, var(--light-2), var(--dark-1));
		display: grid;
		grid-template-columns: 40% 60%;
		grid-template-rows: 60% 10% 30%;
		opacity: 0.8;
	}

	article:hover {
		opacity: 1;
		animation-duration: 0.2s;
	}

	.card-title {
		font-size: 36px;
		max-width: 20ch;
		overflow: hidden;
		text-overflow: ellipsis;
		color: var(--color-neutral-black);
		grid-column: 2/3;
		margin-left: 1em;
	}

	.card-title-url {
		grid-column: 1/2;
		font-size: 28px;
		line-break: strict;
	}

	.card-partner-logo {
		border-radius: var(--border-radius);
		overflow: hidden;
		grid-row: 1/4;
		object-fit: fill;
		width: fit-content;
		height: fit-content;
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
		margin-left: 3em;

		label {
			color: var(--color-neutral-black);
		}
	}

	#url-progress-container {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		justify-content: center;
		align-items: center;
		gap: 1em;
		grid-row: 2/3;
		grid-column: 1/3;
		padding-bottom: 4em;

		label {
			color: var(--color-neutral-black);
			margin-bottom: 1em;
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

	.card-icons-partner {
		grid-row: 3/4;
		grid-column: 2/3;
		display: flex;
		justify-content: flex-end;
		gap: 0.5em;
		align-items: center;
		margin-right: 0.5em;
	}

	.card-icons-url {
		grid-row: 3/4;
		grid-column: 2/3;
		display: flex;
		justify-content: flex-end;
		gap: 0.5em;
		align-items: center;
	}

	@container card-component (width < 600px) {
		#card-partner {
			grid-template-rows: 60% 1fr 1fr 1fr;
			grid-template-columns: 1fr;
			height: fit-content;
		}

		.card-title-url {
			grid-row: 1/2;
			grid-column: 1/3;
			overflow: hidden;
		}

		.card-title {
			grid-row: 2/3;
			grid-column: 1/3;
			display: flex;
			align-items: flex-end;
			margin-left: 0em;
		}

		#partner-progress-container {
			grid-row: 3/4;
			grid-column: 1/3;
			margin-left: 0em;
		}

		#url-progress-container {
			grid-row: 2/3;
			grid-column: 1/3;
		}

		.card-partner-logo {
			grid-column: 1/3;
			grid-row: 1/1;
			width: auto;
			height: auto;
		}

		.card-icons-partner {
			grid-row: 5/5;
		}

		.card-icons-url {
			grid-column: 2/3;
			grid-row: 3/4;
		}
	}

	@container card-component (width < 400px) {
		.card-partner-logo {
			width: 250px;
			height: 250px;
			grid-column: 1/3;
		}

		.card-title {
			grid-column: 1/3;
			grid-row: 2/3;
			height: 1em;
		}

		.card-icons-partner {
			margin-right: 0em;
			margin-bottom: 1em;
			grid-row: 5/5;
			grid-column: 1/3;
		}
	}
</style>
