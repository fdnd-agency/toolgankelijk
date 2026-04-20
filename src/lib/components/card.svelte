<script>
	import { onMount } from 'svelte';
	import Dialog from '$lib/components/dialog.svelte';
	import NavButton from '$lib/components/navButton.svelte';

	export let website;
	export let principles;
	export let params;
	export let isUrl = false;

	let editType;
	let deleteType;
	let auditType;
	let dialogRefEdit;
	let dialogRefDelete;
	let dialogRefAudit;
	let faviconSrc;

	let labelValue;
	let progressbar;
	let lastTime;
	let link;
	let title;
	let url;
	let websiteCriteria;
	let totalCriteria;
	let containerOff = false;
	const updatedTime = new Date(website.updatedAt);
	const currentTime = new Date();
	const timeDifference = Math.floor((currentTime - updatedTime) / (60 * 1000)); 
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
		title = website.title;
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
				const criteria = check.successCriteria ?? [];
				return total + criteria.length;
			}, 0);

			totalCriteria =
				principles.reduce((total, principle) => {
					principle.guidelines.forEach((guideline) => {
						const criteria = guideline.successCriteria ?? [];
						total += criteria.length;
					});
					return total;
				}, 0) * website.checks.length;
		} else {
			websiteCriteria = website.urls.reduce((total, url) => {
				url.checks.forEach((check) => {
					const criteria = check.successCriteria ?? [];
					total += criteria.length;
				});
				return total;
			}, 0);

			totalCriteria =
				principles.reduce((total, principle) => {
					principle.guidelines.forEach((guideline) => {
						const criteria = guideline.successCriteria ?? [];
						total += criteria.length;
					});
					return total;
				}, 0) * website.urls.length;
		}

		let percentage = Math.round((websiteCriteria / totalCriteria) * 100);
		if (isNaN(percentage)) {
			percentage = 0;
		}
		progressbar.value = websiteCriteria;
		progressbar.max = totalCriteria;
		labelValue.innerHTML = `${percentage}%`;
	});
	</script>

<div class="card-wrapper">
    <article class="color-primary-light" id={isUrl ? 'card-url' : 'card-partner'} class:container-off={containerOff}>
        
        {#if !isUrl}
            <picture class="card-partner-logo" fetchpriority="high">
                <img
                    class="partner-logo"
                    src={faviconAPI + url + '/&size=128'}
                    alt="logo van {title}"
                />
            </picture>
        {/if}

        <div class="card-content">
            <h2 class={isUrl ? "card-title-url" : "card-title"}>{title}</h2>

            <div id={isUrl ? "url-progress-container" : "partner-progress-container"} class="color-primary">
                <progress id="progress-partner" max="100" value="0" bind:this={progressbar}></progress>
                <label class="progress-percentage" for="progress-partner" bind:this={labelValue}>0%</label>
            </div>

            <div class={isUrl ? "card-icons-url" : "card-icons-partner"}>
                
                {#if !isUrl}
                    <NavButton
                        onclick={openForm.bind(null, auditType)}
                        aria="start audit {title}"
                        size="small"
                        variant="secondary"
                        showIcon={true}
                        iconName="audit"
                    ></NavButton>
                {/if}

                <NavButton
                    onclick={openForm.bind(null, editType)}
                    aria="bewerk {title}"
                    size="small"
                    variant="secondary"
                    showIcon={true}
                    iconName="edit"
                ></NavButton>

                <NavButton
                    onclick={openForm.bind(null, deleteType)}
                    aria="verwijder {title}"
                    size="small"
                    variant="secondary"
                    showIcon={true}
                    iconName="delete"
                ></NavButton>

                <NavButton
                    href={link}
                    aria="open {title}"
                    size="medium"
                    variant="secondary"
                    showIcon={false}
                >
                    Open
                </NavButton>
            </div>
        </div>
    </article>
</div>

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
		gap: 4em;
		container-type: inline-size;
		container-name: card-component;
	}

	#card-partner {
		background-color: var(--color-neutral-grey);
		padding: 1em;
		border-radius: var(--border-radius);
		width: 100%;
		transition: 0.25s ease;
		display: flex;
		opacity: 0.8;
	}

	#card-url {
		background-color: var(--color-neutral-grey);
		padding: 1em;
		border-radius: var(--border-radius);
		width: 100%;
		transition: 0.25s ease;
		display: flex;
		gap: 1em;
		opacity: 0.8;
	}

	.card-content {
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		gap: 1em;
		width: 100%;
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
		margin-left: 0.5em;
	}

	.card-title-url {
		font-size: 20px;
		width: 50%;
	}

	.card-partner-logo {
		border-radius: var(--border-radius);
		width: 128px;
		height: 128px;
	}

	#partner-progress-container {
		display: flex;
		margin-left: 1em;
		gap: 1em;
		label {
			color: var(--color-neutral-black);
		}
	}

	#url-progress-container {
		margin-left: 0.5em;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		justify-content: center;
		align-items: center;

		label {
			color: var(--color-neutral-black);
		}
	}

	progress {
		width: 100%;
		border-radius: 0.5rem;
		background-color: var(--color-neutral-darkgrey);
		border: none;
		overflow: hidden;
	}

	progress::-webkit-progress-bar {
		background-color: var(--color-neutral-darkgrey);
		border-radius: var(--border-radius);
	}

	progress::-webkit-progress-value {
		background-color: var(--color-primary);
		border-radius: 0.5rem;
		transition: width 1s ease-out;
	}

	progress::-moz-progress-bar {
		background-color: var(--color-primary);
		border-radius: 0.5rem;
		transition: width 1s ease-out;
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
	}

	.card-icons-url {
		display: flex;
		justify-content: flex-end;
		gap: 0.5em;
		align-items: center;
	}

</style>
