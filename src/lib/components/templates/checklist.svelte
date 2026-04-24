<script>
	import { onMount } from 'svelte';
	import { enhance } from '$app/forms';
	import loadingIcon from '$lib/assets/loading.svg';
	import NavButton from '../moleculues/navButton.svelte';

	let {
		guidelines,
		toolboardData,
		levels,
		selectedLevel = $bindable(levels[0].level)
	} = ($props());

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

		<!-- guidelines en successcriteria tekst wordt hier ingeladen! -->
		{#each guidelines as guideline}
			<details>
				<summary class="collapsible-summary">
					<span>Richtlijn {guideline.index}</span>
					<div>
						<h2>{guideline.title}</h2>
						<h3>{@html guideline.explanation.html}</h3>
					</div>
				</summary>
				<article>
					{#each guideline.successCriteria as succescriterium}
						{#if succescriterium.level === selectedLevel}
							<details>
								<summary class="criteria-uitklapbaar">
									<span>Criteria {succescriterium.index} ({succescriterium.level})</span>
									<div class="row">
										<div class="column">
											<h3>{succescriterium.title}</h3>
										</div>

										<div class="column">
											<NavButton
												size="large"
												type="button"
												onclick={(event) => translate(event, succescriterium.index)}
											>
												{simpleTranslation ? 'Officiële beschrijving' : 'Simpele beschrijving'}
											</NavButton>

											<input
												name="check"
												value={succescriterium.id}
												type="checkbox"
												checked={checkedSuccessCriteria.find((e) => e.id === succescriterium.id)}
											/>
										</div>
									</div>
								</summary>

								<!-- tekuitleg voor succescriterium -->
								<div class="richtlijn-uitleg" aria-live="polite" dataindex="0">
									<div class="richtlijn-criteria-1">
										<p id="uitleg" class="tekst-criteria-1">
											{@html succescriterium.easyCriteria && succescriterium.easyCriteria.html}
										</p>
									</div>
									<div class="richtlijn-criteria-2">
										<p id="uitleg" class="tekst-criteria-2">
											{@html succescriterium.criteria && succescriterium.criteria.html}
										</p>
									</div>
								</div>
							</details>
						{/if}
					{/each}
				</article>
			</details>
		{/each}
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
	.richtlijn-criteria-2 {
		display: none;
	}

	.submit {
		position: fixed;
		bottom: 5rem;
		right: 1rem;
		font-size: 1.3rem;
		padding: 0.4rem 0.8rem;
		background-color: var(--color-primary);
		border: none;
		color: white;
		margin-top: 1rem;
		border-radius: 4px;
		cursor: pointer;
		z-index: 2;
	}

	.submit:hover {
		filter: saturate(1.2);
	}

	.submit:not(button) {
		cursor: auto;
		background-color: #a0004025;
		backdrop-filter: blur(3px);
		border: 1px solid var(--color-primary);
		border-radius: 4px;
	}

	.submit img {
		animation: 0.8s rotate infinite;
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

	.richtlijn-uitleg {
		padding-left: 1rem;
	}

	section {
		flex-basis: 0;
		flex-grow: 999;
	}

	form article:not(:first-child) {
		margin-top: 1.5em;
	}

	form article {
		background-color: var(--color-primary-light);
		border-radius: 0.5em;
		border: solid 1px var(--color-neutral-black);
	}

	h3,
	h3 {
		font-size: 1.2rem;
		font-weight: 600;
		margin-top: 1rem;
	}

	span {
		font-weight: 300;
		font-family: 1em;
	}

	label {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-weight: 600;
	}

	label p {
		color: var(--color-neutral-black);
	}

	details {
		padding: 1em;
	}

	summary::marker {
		color: var(--color-primary);
		cursor: pointer;
	}

	details[open] summary ~ * {
		animation: sweep 0.25s ease-in-out;
	}

	section details:not(:nth-child(2)) {
		border-top: 1px solid var(--color-neutral-black);
	}

	.collapsible-summary:hover {
		cursor: pointer;
	}

	.collapsible-summary h2 {
		margin-left: 1.2rem;
		margin-bottom: 0.8rem;
		margin-top: 0.8rem;
	}

	.collapsible-summary h3 {
		margin-left: 1.2rem;
		margin-bottom: 0.8rem;
	}

	span {
		margin-left: 0.3rem;
	}

	.criteria-uitklapbaar {
		flex-direction: row;
		align-items: center;
	}

	.row {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	.column {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 1rem;
	}

	details > div {
		font-size: 0.9em !important;
		padding-top: 1em;
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

	#niveau-toggle {
		margin-bottom: 1em;
	}

	.richtlijn-criteria-2 {
		display: none;
	}

	:global(.richtlijn-uitleg.moeiluk .richtlijn-criteria-1) {
		display: none;
	}

	:global(.richtlijn-uitleg.moeiluk div.richtlijn-criteria-2) {
		display: block !important;
	}

	:global(#uitleg p) {
		line-height: 1.5;
		margin-top: 1em;
		margin-bottom: 1em;
		max-width: 30em;
	}

	:global(#uitleg ul) {
		line-height: 1.5;
		margin-top: 1em;
		margin-bottom: 1em;
		max-width: 30em;
	}

	@media print {
		.submit {
			display: none;
		}
	}

	@keyframes rotate {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	@keyframes sweep {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}
</style>