<script>
	import { enhance } from '$app/forms';
	import loadingIcon from '$lib/assets/loading.svg';
	import NavButton from '../molecules/navButton.svelte';
	import Checkbox from '../molecules/checkbox.svelte';

	// selectedLevel and description come from the filters in the subheader (?niveau=...&beschrijving=...)
	let { guidelines, toolboardData, selectedLevel, description = 'simpel' } = $props();

	let loading = $state(false);

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
			return async ({ update }) => {
				loading = false;
				update({ reset: false });
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
				{/if}
			{/each}
		</ul>

		{#if loading}
			<div class="submit">
				<img src={loadingIcon} alt="laadt icoontje" height="32" width="32" />
			</div>
		{:else}
			<div class="form-btn">
				<NavButton type="submit" size="medium" aria="opslaan checklist">Opslaan</NavButton>

				<NavButton size="medium" variant="primary" showIcon={false} href="#main">
					<p>Scroll to Top</p>
				</NavButton>
			</div>
		{/if}
	</form>
</section>

<div class="changed"></div>

<style>
	section {
		flex-basis: 0;
		flex-grow: 999;
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
		font-weight: 300;
		margin-left: 0.3rem;
	}

	details[open] summary ~ * {
		animation: sweep 0.25s ease-in-out;
	}

	/* Guideline detail and summary */
	form > ul > li {
		border-top: 1px solid var(--color-neutral-black);
	}

	form > ul > li > details {
		padding: 1em;
	}

	.collapsible-summary h2,
	.collapsible-summary h2 ~ :global(p) {
		margin-left: 1.2rem;
		margin-bottom: 0.8rem;
	}

	.collapsible-summary h2 {
		margin-top: 0.8rem;
	}

	/* Criteria details and summary */
	.criteria {
		background-color: var(--color-primary-light);
		border-radius: 0.5em;
		border: solid 1px var(--color-neutral-black);
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
		border-top: 1px solid var(--color-neutral-black);
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
		padding: 1em 0 0 1rem;
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
</style>
