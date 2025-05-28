<script>
	import { onMount } from 'svelte';
	import trash from '$lib/assets/trash.svg';
	import pencil from '$lib/assets/pencil.svg';
	import AddForm from '$lib/components/addForm.svelte';

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

<li class="website" class:container-off={containerOff}>
	<a href={link}>
		<section class="logo-partner-section">
			<div>
				<img
					class="partner-logo"
					width="60"
					height="60"
					src={faviconAPI + url + '/&size=128'}
					alt="logo partner"
				/>
				<h2 class="name">{title}</h2>
			</div>
			<div class="icons" id={`icons-${website.id}`}>
				{#if !isUrl}
					<button on:click={openForm.bind(null, auditType)}>
						<img width="24" height="24" src={pencil} alt="Audit icon" />
					</button>
				{/if}
				<button on:click={openForm.bind(null, editType)}
					><img width="24" height="24" src={pencil} alt="Bewerk icon" /></button
				>
				<button on:click={openForm.bind(null, deleteType)}
					><img width="24" height="24" src={trash} alt="Verwijder icon" /></button
				>
			</div>
		</section>

		<section class="more-info-section">
			<p>Laatst bewerkt: <time>{lastTime}</time></p>

			<div class="progress-container">
				<progress id="progress-partner" max="100" value="0" bind:this={progressbar} />
				<label class="progress-percentage" for="progress-partner" bind:this={labelValue}>0%</label>
			</div>
		</section>
	</a>
</li>

<AddForm
	bind:this={dialogRefEdit}
	isType={editType}
	id={website.id}
	name={title}
	{url}
	slug={website.slug}
	website = {website}
/>
<AddForm
	bind:this={dialogRefDelete}
	isType={deleteType}
	id={website.id}
	name={title}
	{url}
	slug={website.slug}
	website = {website}
/>
<AddForm
	bind:this={dialogRefAudit}
	isType={auditType}
	id={website.id}
	name={title}
	{url}
	slug={website.slug}
	website = {website}
/>

<style>
	li {
		display: flex;
	}

	li a {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		gap: 1rem;
		color: var(--c-text);
		text-decoration: none;
		background-color: var(--c-container);
		padding: 1em;
		border-radius: 0.5rem;
		border: solid 0.1rem var(--c-container-stroke);
		width: 100%;
		transition: 0.25s ease;
	}

	li a:hover {
		border: solid 0.1rem var(--c-orange);
	}

	h2 {
		font-size: 1.5rem;
		max-width: 20ch;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.logo-partner-section {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		position: relative;
	}

	.logo-partner-section div:nth-of-type(1) {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.5rem;
	}

	.partner-logo {
		width: 4rem;
		height: 4rem;
		border-radius: 0.5rem;
		overflow: hidden;
	}

	.icons {
		display: flex;
		justify-content: space-between;
		position: absolute;
		right: 0;
		top: 0;
	}

	.icons button {
		padding: 0.25rem;
		border-radius: 0.5rem;
		width: 2.5rem;
		height: 2.5rem;
	}

	.icons button:hover {
		background-color: var(--c-orange);
		transition: 0.25s ease;
	}

	a section button {
		background: none;
		cursor: pointer;
		border: none;
	}

	a section button {
		margin-right: 0.5rem;
	}

	.more-info-section {
		display: flex;
		flex-direction: column;
		font-size: 1rem;
	}

	.more-info-section p {
		font-weight: 600;
	}

	.more-info-section p time {
		font-weight: normal;
	}

	.progress-container {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: flex-end;
		gap: 1rem;
		margin-top: 0.25rem;
	}

	progress {
		width: 100%;
		border-radius: 0.5rem;
		background-color: var(--c-container-stroke);
		border: none;
		overflow: hidden;
	}

	progress[value] {
		-webkit-appearance: none;
		appearance: none;
	}

	progress[value]::-webkit-progress-bar {
		background-color: var(--c-container-stroke);
		border-radius: 0.5rem;
	}

	progress[value]::-webkit-progress-value {
		background-color: var(--c-orange);
		border-radius: 0.5rem;
		transition: 1s ease-out;
	}

	progress[value]::-moz-progress-bar {
		background-color: var(--c-orange);
		border-radius: 0.5rem;
		transition: 1s ease-out;
	}

	.progress-percentage {
		height: 85%;
	}

	.container-off {
		display: none;
	}

	@media (inverted-colors: inverted) {
		li a {
			border: solid 0.1rem white;
		}
	}
</style>
