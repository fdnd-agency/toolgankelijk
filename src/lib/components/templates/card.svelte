<script>
	import Dialog from '$lib/components/templates/dialog.svelte';
	import NavButton from '$lib/components/molecules/navButton.svelte';

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

	const typeConfig = $derived(
		isUrl
			? {
					link: `${params?.websiteUID || ''}/${website.slug}`,
					url: website.url,
					title: website.name,
					edit: 'editUrl',
					delete: 'deleteUrl',
					audit: null
				}
			: {
					link: `/${website.slug}?partner=${website.slug}`,
					url: website.homepage,
					title: website.title,
					edit: 'editPartner',
					delete: 'deletePartner',
					audit: 'startAudit'
				}
	);

	function calculatePercentage(websiteCriteria, totalCriteria) {
		// Validation
		// Values must be finite
		if (!Number.isFinite(websiteCriteria) || !Number.isFinite(totalCriteria)) {
			console.warn('Card progressbar received non-finite values!', {
				websiteCriteria,
				totalCriteria
			});
			return 0;
		}

		// criteria values must be positive
		if (totalCriteria < 0 || websiteCriteria < 0) {
			console.warn('Card progressbar received negative values!', {
				websiteCriteria,
				totalCriteria
			});
			return 0;
		}
		// websiteCriteria must not be greater than totalCriteria
		if (websiteCriteria > totalCriteria) {
			console.warn('Card progressbar received more websiteCriteria than totalCriteria!', {
				websiteCriteria,
				totalCriteria
			});
		}

		// Calculation
		let percentage = (websiteCriteria / totalCriteria) * 100;

		// Impossible values are set to 0.
		if (!Number.isFinite(percentage)) {
			return 0;
		}

		// Clamp to [0, 100]
		percentage = Math.round(Math.min(Math.max(percentage, 0), 100));

		return percentage;
	}

	const stats = $derived.by(() => {
		let total = 0;
		let success = 0;

		const baseCriteriaCount = principles.reduce(
			(acc, p) =>
				acc + p.guidelines.reduce((gAcc, g) => gAcc + (g.successCriteria?.length || 0), 0),
			0
		);

		if (isUrl) {
			success = website.checks?.reduce((acc, c) => acc + (c.successCriteria?.length || 0), 0) || 0;
			total = baseCriteriaCount;
		} else {
			success =
				website.urls?.reduce(
					(acc, u) =>
						acc + u.checks.reduce((cAcc, c) => cAcc + (c.successCriteria?.length || 0), 0),
					0
				) || 0;
			total = baseCriteriaCount * (website.urls?.length || 0);
		}

		return { success, total, percent: calculatePercentage(success, total) };
	});

	function openForm(type, event) {
		event.preventDefault();
		const map = {
			[typeConfig.edit]: dialogRefEdit,
			[typeConfig.delete]: dialogRefDelete,
			[typeConfig.audit]: dialogRefAudit
		};
		map[type]?.open();

		document.body.style.overflowY = 'hidden';
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	const faviconAPI =
		'https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=';
</script>

<div class="card-wrapper">
	<a
		href={typeConfig.link}
		class="color-primary-light"
		id={isUrl ? 'card-url' : 'card-partner'}
		class:container-off={containerOff}
	>
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
			<h2 class={isUrl ? 'card-title-url' : 'card-title'}>{typeConfig.title}</h2>

			<div
				id={isUrl ? 'url-progress-container' : 'partner-progress-container'}
				class="color-primary"
			>
			{#if !isUrl && typeConfig.audit}
				<div class="automatic-tests">
					<!-- automatic tests -->
					<progress id="progress-partner" max="100" value={stats.percent}></progress>
					<!-- manual tests -->
					<label class="progress-percentage" for="progress-partner">{stats.percent}%</label>
				</div>
			{/if}



			<div class="manual-tests">
				<progress id="progress-partner" max="100" value='50'></progress>

				<label class="progress-percentage" for="progress-partner">{stats.percent}%</label>
			</div>

			</div>


			<div class={isUrl ? 'card-icons-url' : 'card-icons-partner'}>
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

				<div class="custom-nav-override">

				</div>
			</div>
		</div>
	</a>
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
	a {
		text-decoration: none;
	}
	
	.card-wrapper {
		display: flex;
		gap: 4em;
		container-type: inline-size;
		container-name: card-component;

	}

	#card-partner {
		background-color: var(--color-background-card);
		padding: 1em;
		border-radius: var(--border-radius);
		width: 100%;
		transition: 0.25s ease;
		display: flex;
		opacity: 0.8;
	}

	#card-url {
		background-color: var(--color-background-card);
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

	#card-partner:hover {
		background-color: var(--color-primary-light-2);
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
		width: 100%;
		
	}

	.card-partner-logo {
		border-radius: var(--border-radius);
		width: 128px;
		height: 128px;
		display: flex;
		background: white;
		justify-content: center;
	}

	#partner-progress-container {
		display: flex;
		flex-direction: column;
		margin-left: 1em;
		gap: 1em;
		label {
			color: var(--color-neutral-black);
		}
	}

	#url-progress-container {
		display: flex;
		gap: 2em;
		flex-direction: column;
		width: 100%;

		progress {
			width: 95%;
		}
		label {
			color: var(--color-neutral-black);
		}
	}

	progress {
		width: 90%;
		border-radius: 0.5rem;
		background-color: var(--color-neutral-white);
		border: none;
		overflow: hidden;
	}

	progress::-webkit-progress-bar {
		background-color: var(--color-neutral-white);
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
		justify-content: flex-start;
		margin-left: 1em;
		gap: 0.5em;
		align-items: center;
	}

	.card-icons-partner > :global(.navbutton) {
		border: none !important;
	}

	.card-icons-url {
		display: flex;
		justify-content: flex-start;
		margin-left: 1em;
		gap: 0.5em;
		align-items: center;
	}

	.custom-nav-override :global(button),
	.custom-nav-override :global(a) {
		background-color: #b9005f !important;
		border-color: #b9005f !important;
		color: white !important;
	}
</style>
