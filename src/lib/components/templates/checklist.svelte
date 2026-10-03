<script>
	// checklist is not refactored yet
	import { onMount } from 'svelte';
	import { enhance } from '$app/forms';
	import loadingIcon from '$lib/assets/loading.svg';
	import NavButton from '../molecules/navButton.svelte';

	let { guidelines, toolboardData, levels, selectedLevel = $bindable(levels[0].level) } = $props();

	let loading = $state(false);
	const getSuccessCriteriaByLevel = (level) =>
		toolboardData.url.checks[0].successCriteria.filter((item) => item.level === level);

	let filteredSuccessCriteria = getSuccessCriteriaByLevel(selectedLevel);

	const handleLevelChange = (event) => {
		selectedLevel = event.target.value;
		filteredSuccessCriteria = getSuccessCriteriaByLevel(selectedLevel);
	};

	let simpleTranslation = $state(true);

	const checkedSuccessCriteria = $derived(toolboardData.url.checks[0].successCriteria);

	function translate(event) {
		const button = event.target;
		const activeSection = button.closest('details');
		const uitleg = activeSection.querySelector('.richtlijn-uitleg');

		/** De simpele vertaling wordt omgezet in true of false. op basis van de button die geklikt is en welke waarde die dan heeft. */
		simpleTranslation = !simpleTranslation;

		/** De tekst en button worden ook steeds omgedraaid op basis van de button (van officieel naar simpel) */
		uitleg.classList.toggle('moeiluk');
		button.classList.toggle('moeiluk');
	}

	onMount(() => {
		const levelToggle = document.querySelector('#niveau-toggle');
		levelToggle.classList.toggle('disabled');
	});
</script>

<section>
	<div id="niveau-toggle" class="disabled">
		<label>
			<p>Selecteer niveau</p>
			<select bind:value={selectedLevel} onchange={handleLevelChange}>
				{#each levels as level}
					<option value={level.level}>Niveau {level.level}</option>
				{/each}
			</select>
		</label>
	</div>

	<form
		method="POST"
		action="?/updateChecklist"
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
			<!-- guidelines en successcriteria text are being loaded in! -->
			{#each guidelines as guideline}
				<li>
					<details>
						<summary class="collapsible-summary">
							<hgroup>
								<p>Richtlijn {guideline.index}</p>
								<h2>{guideline.title}</h2>
								<p>{@html guideline.explanation.html}</p>
							</hgroup>
						</summary>
						<ul class="criteria">
							{#each guideline.successCriteria as succescriterium}
								{#if succescriterium.level === selectedLevel}
									<li>
										<details>
											<summary class="collapsible-criteria">
												<hgroup>
													<p>Criteria {succescriterium.index} ({succescriterium.level})</p>
													<div class="title-and-checkmark">
														<h3>{succescriterium.title}</h3>
														<label class="column">
															<span class="visually-hidden">Criteria {succescriterium.index} ({succescriterium.level}) voldoet</span>
															<input
																name="check"
																value={succescriterium.id}
																type="checkbox"
																checked={checkedSuccessCriteria.find(
																	(e) => e.id === succescriterium.id
																)}
															/>
														</label>
													</div>
												</hgroup>
											</summary>

											<!-- text explanation for success criteria -->
											<div class="richtlijn-uitleg" aria-live="polite" dataindex="0">
												<div class="richtlijn-criteria-1">
													<p id="uitleg" class="tekst-criteria-1">
														{@html succescriterium.easyCriteria &&
															succescriterium.easyCriteria.html}
													</p>
												</div>
												<div class="richtlijn-criteria-2">
													<p id="uitleg" class="tekst-criteria-2">
														{@html succescriterium.criteria && succescriterium.criteria.html}
													</p>
												</div>
											</div>
										</details>
									</li>
								{/if}
							{/each}
						</ul>
					</details>
				</li>
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

	#niveau-toggle {
		margin-bottom: 1em;
	}

	#niveau-toggle label {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-weight: 600;
	}

	#niveau-toggle p {
		color: var(--color-neutral-black);
	}

	select {
		border-radius: var(--border-radius);
		padding: 0.5em 1em;
		color: var(--c-white);
		background-color: var(--color-primary-light);
		border: none;
		font-weight: 600;
		font-size: 1em;
		cursor: pointer;
	}

	ul {
		list-style: '';
	}

	details {
		padding: 1em;
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

	.collapsible-summary h2,
	.collapsible-summary p:not(:first-child){
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

	.criteria > li:not(:first-child) {
		border-top: 1px solid var(--color-neutral-black);
	}

	.title-and-checkmark {
		display: grid;
		grid-template-columns: 1fr auto;
		align-items: center;
		gap: 0.5em;
	}

	h3 {
		font-size: 1.2rem;
		font-weight: 600;
		margin-top: 1rem;
	}

	.visually-hidden {
		position: absolute;
		left: 99999em;
	}

	input[type='checkbox'] {
		-webkit-appearance: none;
		appearance: none;
		margin: 0;
		color: var(--color-primary);
		min-width: 2em;
		width: 2em;
		height: 2em;
		border: 0.15em solid currentColor;
		border-radius: 0.3em;
		transform: translateY(-0.075em);
		display: grid;
		place-content: center;
	}

	input[type='checkbox']::before {
		content: '';
		width: 1em;
		height: 1em;
		clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
		transform: scale(0);
		background-color: var(--color-primary);
	}

	input[type='checkbox']:checked::before {
		transform: scale(1);
	}

	input[type='checkbox']:checked {
		background-color: var(--color-primary);
	}

	/* Criterion text */
	.richtlijn-uitleg {
		padding: 1em 0 0 1rem;
		font-size: 0.9em;
	}

	.richtlijn-criteria-2 {
		display: none;
	}

	:global(.richtlijn-uitleg.moeiluk .richtlijn-criteria-1) {
		display: none;
	}

	:global(.richtlijn-uitleg.moeiluk .richtlijn-criteria-2) {
		display: block;
	}

	:global(#uitleg p),
	:global(#uitleg ul) {
		line-height: 1.5;
		margin-block: 1em;
		max-width: 30em;
	}

	:global(#uitleg ul) {
		list-style: disc;
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