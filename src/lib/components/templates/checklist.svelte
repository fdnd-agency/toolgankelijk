<script>
	import { enhance } from '$app/forms';
	import loadingIcon from '$lib/assets/loading.svg';
	import NavButton from '../molecules/navButton.svelte';
	import Checkbox from '../molecules/checkbox.svelte';

	// selectedLevel and description come from the filters in the subheader (?niveau=...&beschrijving=...)
	let { guidelines, toolboardData, selectedLevel, description = 'simpel', success = false } = $props();

	let loading = $state(false);

	let showSuccess = $state(false);

	const checkedSuccessCriteria = $derived(toolboardData.url.checks[0].successCriteria);

	// keep the chosen filters in the url when saving, also without JavaScript
	let formAction = $derived(
		`?${new URLSearchParams({ niveau: selectedLevel, beschrijving: description })}&/updateChecklist`
	);
</script>

<section>
	<form
		method="POST"
		action={formAction}
		use:enhance={() => {
			loading = true;
			showSuccess = false;
			return async ({ result, update }) => {
				loading = false;
				if (result.type === 'success') {
					showSuccess = true;   // set before update() runs
				}
				await update({ reset: false });
			};
		}}
	>
		<input type="hidden" name="niveau" value={selectedLevel} />
		<input type="hidden" name="principe" value={toolboardData.principle.index} />

		<ul>
			<!-- guidelines and successcriteria text are being loaded in! -->
			{#each guidelines as guideline}
				<!-- true if at least one criterion of this guideline has the selected level -->
				{@const hasCriteriaAtThisLevel = guideline.successCriteria.some(
					(criterion) => criterion.level === selectedLevel
				)}

				{#if hasCriteriaAtThisLevel}
					<li>
						<details name="guideline">
							<summary class="collapsible-summary">
								<hgroup>
									<p>Richtlijn {guideline.index}</p>
									<h2>{guideline.title}</h2>
									{@html guideline.explanation.html}
								</hgroup>
							</summary>
							<ul class="criteria">
								{#each guideline.successCriteria as succescriterium}
									{#if succescriterium.level === selectedLevel}
										<li>
											<details name="criterion">
												<summary class="collapsible-criteria">
													<hgroup>
														<p>Criteria {succescriterium.index} ({succescriterium.level})</p>
														<h3>{succescriterium.title}</h3>
													</hgroup>
												</summary>

												<!-- text explanation for success criteria -->
												<div class="richtlijn-uitleg">
													{#if description === 'officieel'}
														{@html succescriterium.criteria && succescriterium.criteria.html}
													{:else}
														{@html succescriterium.easyCriteria &&
															succescriterium.easyCriteria.html}
													{/if}
												</div>
											</details>
											<label>
												<span class="visually-hidden"
													>Criteria {succescriterium.index} ({succescriterium.level}) voldoet</span
												>
												<Checkbox
													name="check"
													value={succescriterium.id}
													checked={checkedSuccessCriteria.some((e) => e.id === succescriterium.id)}
												/>
											</label>
										</li>
									{/if}
								{/each}
							</ul>
						</details>
					</li>
				{:else}
					<li class="guideline-without-criteria">
						<hgroup>
							<p>Richtlijn {guideline.index}</p>
							<h2>{guideline.title}</h2>
						</hgroup>
						<p>Er zijn geen criteria voor deze richtlijn op niveau {selectedLevel}.</p>
					</li>
				{/if}
			{/each}
		</ul>

		<div class="action">
			{#if loading}
				<div class="submit">
					<img src={loadingIcon} alt="laadt icoontje" height="32" width="32" />
				</div>
			{:else}
				<div class="form-btn">
					<NavButton type="submit" size="medium" aria="opslaan checklist">Opslaan</NavButton>
				</div>
			{/if}

			<!-- when you click on save it shows a toast must be refactored -->
			{#if !loading && (showSuccess || success)}
				<div class="toast">
					<p>
						<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="20" viewBox="0 0 256 256" xml:space="preserve"><g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)"><polygon points="37.95,64.44 23.78,50.27 30.85,43.2 37.95,50.3 59.15,29.1 66.22,36.17 " style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(22,118,51); fill-rule: nonzero; opacity: 1;" transform="  matrix(1 0 0 1 0 0) "/><path d="M 45 90 C 20.187 90 0 69.813 0 45 C 0 20.187 20.187 0 45 0 c 24.813 0 45 20.187 45 45 C 90 69.813 69.813 90 45 90 z M 45 10 c -19.299 0 -35 15.701 -35 35 s 15.701 35 35 35 s 35 -15.701 35 -35 S 64.299 10 45 10 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(22,118,51); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round"/></g></svg>
						Wijzigingen succesvol opgeslagen
					</p>
				</div>
			{/if}
		</div>
	</form>
</section>

<div class="changed"></div>

<style>
	section {
		flex-basis: 0;
		flex-grow: 999;
		color: var(--color-primary-darkest);
	}

	ul {
		list-style: '';
	}

	summary {
		cursor: pointer;
	}

	summary::marker {
		color: var(--color-primary);
	}

	summary hgroup {
		display: inline;
	}

	/* Small label in summary*/
	hgroup > p:first-child {
		display: inline;
		font-weight: 700;
		margin-left: 0.3rem;
	}

	hgroup > h3 {
		font-weight: 500;
	}

	details[open] summary ~ * {
		animation: sweep 0.25s ease-in-out;
	}

	summary:focus-visible {
		outline: 2px solid var(--color-primary);
  		outline-offset: 4px;
	}

	/* Guideline detail and summary */
	form > ul > li {
		border-top: 1px solid var(--color-primary-darkest);
	}

	form > ul > li > details,
	.guideline-without-criteria {
		padding: 1em;
	}

	.collapsible-summary h2,
	.collapsible-summary h2 ~ :global(p),
	.guideline-without-criteria h2,
	.guideline-without-criteria p,
	.guideline-without-criteria hgroup p {
		margin-left: 1.2rem;
		margin-bottom: 0.8rem;
	}

	.collapsible-summary h2,
	.guideline-without-criteria h2 {
		margin-top: 0.8rem;
	}

	/* Criteria details and summary */
	.criteria {
		background-color: var(--color-primary-lightest);
		border-radius: 0.5em;
		margin-top: 1.5em;
	}

	.criteria > li {
		display: grid;
		padding: 1em;
	}

	.criteria > li > details {
		grid-area: 1 / 1;
	}

	.criteria > li > label {
		grid-area: 1 / 1;
		justify-self: end;
		align-self: start;
		margin-top: calc(1lh + 1rem);
	}

	.collapsible-criteria {
		padding-right: 2.5em;
	}

	.criteria > li:not(:first-child) {
		border-top: 1px solid var(--color-neutral-grey);
	}

	h3 {
		font-size: 1.2rem;
		font-weight: 600;
		margin-top: 1rem;
	}

	.visually-hidden {
		position: absolute;
		width: 1px;
		height: 1px;
		margin: -1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}

	/* Criterion text */
	.richtlijn-uitleg {
		padding: 1em 0 0;
		font-size: 0.9em;
	}

	/* Loading state */
	.submit {
		position: fixed;
		bottom: 5rem;
		right: 1rem;
		padding: 0.4rem 0.8rem;
		background-color: #a0004025;
		backdrop-filter: blur(3px);
		border: 1px solid var(--color-primary);
		border-radius: 4px;
		z-index: 2;
	}

	.submit img {
		animation: 0.8s rotate infinite;
	}

	@media print {
		.submit {
			display: none;
		}
	}

	@keyframes rotate {
		to {
			transform: rotate(360deg);
		}
	}

	@keyframes sweep {
		from {
			opacity: 0;
		}
	}

	.action {
		display: flex;
		gap: .8em;
	}

	.toast {
		display: flex;
		justify-content: center;
		align-items: center;
		bottom: 5rem;
		right: 1rem;
		height: 2rem;
		width: 19rem;
		border-radius: 4px;
		padding: 0.5rem;
		animation: bounce .8s ease-in-out;
		z-index: 2;

		p {
			display: flex;
			align-items: center;
			text-align: center;
			font-weight: 600;
			gap: .3rem;
			width: 40ch;
			color: var(--color-accent-success);
		}
	}

	@keyframes bounce {
		0% {
			scale: 1;
		}
		50% {
			scale: 1.1;
		}
		100% {
			scale: 1;
		}
	}

</style>