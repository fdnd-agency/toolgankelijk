<script>
	import Dialog from '$lib/components/templates/dialog.svelte';
	import NavButton from '$lib/components/moleculues/navButton.svelte';

	let { 
        principles = [], 
        website = {},
        params,
        isUrl = false,
        dialogRefAudit,
        dialogRefDelete,
        dialogRefEdit,
        containerOff = false
    } = $props();

	const typeConfig = $derived(isUrl ? {
		link: `${params}/${website.slug}`,
        url: website.url,
        title: website.name,
        edit: 'editUrl',
        delete: 'deleteUrl',
        audit: null
	} : {
		link: `${website.slug}?partner=${website.slug}`,
        url: website.homepage,
        title: website.title,
        edit: 'editPartner',
        delete: 'deletePartner',
        audit: 'startAudit'
	});
	
	const lastTime = $derived.by(() => {
        if (!website.updatedAt) return 'Zojuist';
        const diffInMs = new Date() - new Date(website.updatedAt);
        const mins = Math.floor(diffInMs / 60000);
        
        if (mins < 1) return 'Zojuist';
        if (mins < 60) return `${mins} min geleden`;
        
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `${hours} uur en ${mins % 60} min geleden`;
        
        const days = Math.floor(hours / 24);
        if (days < 365) return days === 1 ? '1 dag geleden' : `${days} dagen geleden`;
        
        return `${Math.floor(days / 365)} jaar geleden`;
    });

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

        if (isUrl) {
            success = website.checks?.reduce((acc, c) => acc + (c.successCriteria?.length || 0), 0) || 0;
            total = baseCriteriaCount * (website.checks?.length || 0);
        } else {
            success = website.urls?.reduce((acc, u) => 
                acc + u.checks.reduce((cAcc, c) => cAcc + (c.successCriteria?.length || 0), 0), 0) || 0;
            total = baseCriteriaCount * (website.urls?.length || 0);
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
                    src="{faviconAPI}{typeConfig.url}/&size=128"
                    alt="logo van {typeConfig.title}"
                />
            </picture>
        {/if}

        <div class="card-content">
            <h2 class={isUrl ? "card-title-url" : "card-title"}>{typeConfig.title}</h2>

            <div id={isUrl ? "url-progress-container" : "partner-progress-container"} class="color-primary">
                <progress id="progress-partner" max="100" value="0" bind:this={progressbar}></progress>
                <label class="progress-percentage" for="progress-partner" bind:this={labelValue}>0%</label>
            </div>

            <div class={isUrl ? "card-icons-url" : "card-icons-partner"}>
                
                {#if !isUrl && typeConfig.audit}
                    <NavButton
                        onclick={(e) => openForm(typeConfig.audit, e)}
                        aria="start audit {typeConfig.title}"
                        size="small"
                        variant="secondary"
                        showIcon={true}
                        iconName="audit"
                    ></NavButton>
                {/if}

                <NavButton
                    onclick={(e) => openForm(typeConfig.edit, e)}
                    aria="bewerk {typeConfig.title}"
                    size="small"
                    variant="secondary"
                    showIcon={true}
                    iconName="edit"
                ></NavButton>

                <NavButton
                    onclick={(e) => openForm(typeConfig.delete, e)}
                    aria="verwijder {typeConfig.title}"
                    size="small"
                    variant="secondary"
                    showIcon={true}
                    iconName="delete"
                ></NavButton>

                <NavButton
                    href={typeConfig.link}
                    aria="open {typeConfig.title}"
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
	isType={typeConfig.edit}
	id={website.id}
	name={typeConfig.title}
	url={typeConfig.url}
	slug={website.slug}
	{website}
/>
<Dialog
	bind:this={dialogRefDelete}
	isType={typeConfig.delete}
	id={website.id}
	name={typeConfig.title}
	url={typeConfig.url}
	slug={website.slug}
	{website}
/>
{#if !isUrl && typeConfig.audit}
<Dialog
	bind:this={dialogRefAudit}
	isType={typeConfig.audit}
	id={website.id}
	name={typeConfig.title}
	url={typeConfig.url}
	slug={website.slug}
	{website}
/>
{/if}

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
