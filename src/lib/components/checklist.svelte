<script>
	import { onMount } from 'svelte';
	import { enhance } from '$app/forms';
	import loadingIcon from '$lib/assets/loading.svg';

	export let richtlijnen;
	export let toolboardData;
	export let selectedNiveau = 'A';

	let loading = false;
	let simpleTranslation = true;

	const getSuccescriteriaByNiveau = (niveau) =>
		toolboardData.url.checks[0]
			? toolboardData.url.checks[0].succescriteria.filter((item) => item.niveau === niveau)
			: [];

	let filteredSuccescriteria = getSuccescriteriaByNiveau(selectedNiveau);

	const handleNiveauChange = (event) => {
		selectedNiveau = event.target.value;
		filteredSuccescriteria = getSuccescriteriaByNiveau(selectedNiveau);
	};

	const checkedSuccescriteria = toolboardData.url.checks[0]
		? toolboardData.url.checks[0].succescriteria
		: [];

	function scrollToTop(event) {
		const mainElement = document.getElementById('main');
		mainElement.scrollIntoView({ behavior: 'smooth' });
		event.preventDefault();
	}

	function translate(event) {
		const button = event.target;
		const activeSection = button.closest('details');
		const uitleg = activeSection.querySelector('.richtlijn-uitleg');

		/** De simpele vertaling wordt omgezet in true of false. op basis van de button die geklikt is en welke waarde die dan heeft. */
		simpleTranslation = !simpleTranslation;

		/** De tekst en button worden ook steeds omgedraaid op basis van de button (van officieel naar simpel) */
		uitleg.classList.toggle('moeilijk');
		button.classList.toggle('moeilijk');
	}

	onMount(() => {
		const niveauToggle = document.querySelector('#niveau-toggle');
		niveauToggle.classList.toggle('disabled');
	});
</script>

<section>
	<div id="niveau-toggle" class="disabled">
		<label>
			<p>Selecteer niveau</p>
			<select bind:value={selectedNiveau} on:change={handleNiveauChange}>
				<option value="A">Niveau A</option>
				<option value="AA">Niveau AA</option>
				<option value="AAA">Niveau AAA</option>
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
		<input type="hidden" name="niveau" value={selectedNiveau} />
		<input type="hidden" name="principe" value={toolboardData.principe.index} />

		<!-- richtlijnen en succescriteria tekst wordt hier ingeladen! -->
		{#each richtlijnen as richtlijn}
			<details>
				<summary class="collapsible-summary">
					<span>Richtlijn {richtlijn.index}</span>
					<div>
						<h2>{richtlijn.titel}</h2>
						<h3>{@html richtlijn.uitleg.html}</h3>
						<div />
					</div>
				</summary>
				<article>
					{#each richtlijn.succescriteria as succescriterium}
						{#if succescriterium.niveau === selectedNiveau}
							<details>
								<summary class="criteria-uitklapbaar">
									<span>Criteria {succescriterium.index} ({succescriterium.niveau})</span>
									<div class="row">
										<div class="column">
											<h3>{succescriterium.titel}</h3>
										</div>

										<div class="column">
											<button
												type="button"
												class="btn-vertaling"
												on:click={(event) => translate(event)}
											>
												{simpleTranslation ? 'Officiële beschrijving' : 'Simpele beschrijving'}
											</button>

											<input
												name="check"
												value={succescriterium.id}
												type="checkbox"
												checked={checkedSuccescriteria.find((e) => e.id === succescriterium.id)}
											/>
										</div>
									</div>
								</summary>

								<!-- tekuitleg voor succescriterium -->
								<div class="richtlijn-uitleg" aria-live="polite" dataindex="0">
									<div class="richtlijn-criteria-1">
										<p id="uitleg" class="tekst-criteria-1">
											{@html succescriterium.makkelijkeCriteria &&
												succescriterium.makkelijkeCriteria.html}
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
				<button type="submit" class="submit"> Opslaan </button>
				<a href="#main" class="btn-top" on:click={scrollToTop}>⬆</a>
			</div>
		{/if}
	</form>
</section>

<div class="changed" />

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
		background-color: var(--c-pink);
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

	.btn-top {
		position: fixed;
		bottom: 1rem;
		right: 1rem;
		font-size: 1.3rem;
		padding: 0.4rem 0.8rem;
		background-color: var(--c-pink);
		border: none;
		color: white;
		margin-top: 1rem;
		border-radius: 4px;
		cursor: pointer;
		text-decoration: none;
		z-index: 2;
	}

	.btn-top:hover {
		filter: saturate(1.2);
	}

	button:active {
		filter: saturate(1) brightness(0.9);
	}

	.submit:not(button) {
		cursor: auto;
		background-color: #a0004025;
		backdrop-filter: blur(3px);
		border: 1px solid var(--c-pink);
		border-radius: 4px;
	}

	.submit img {
		animation: 0.8s rotate infinite;
	}

	select {
		border-radius: 0.25em;
		padding: 0.5em 1em;
		color: var(--c-white);
		background-color: var(--c-modal-button);
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
		background-color: var(--c-container);
		border-radius: 0.5em;
		border: solid 1px var(--c-container-stroke);
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
		color: var(--c-white2);
	}

	details {
		padding: 1em;
	}

	summary::marker {
		color: var(--c-pink);
		cursor: pointer;
	}

	details[open] summary ~ * {
		animation: sweep 0.25s ease-in-out;
	}

	section details:not(:nth-child(2)) {
		border-top: 1px solid var(--c-container-stroke);
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

	/* Custom checkbox styling */
	input[type='checkbox'] {
		-webkit-appearance: none;
		appearance: none;
		margin: 0;
		color: var(--c-pink);
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
		background-color: white;
	}

	input[type='checkbox']:checked::before {
		transform: scale(1);
	}

	input[type='checkbox']:checked {
		background-color: var(--c-pink);
	}

	#niveau-toggle {
		margin-bottom: 1em;
	}

	.btn-vertaling {
		font-size: 1rem;
		padding: 0.4rem 0.8rem;
		background-color: var(--c-pink);
		border: none;
		color: white;
		border-radius: 4px;
		cursor: pointer;
		z-index: 2;
	}

	.btn-vertaling:hover {
		filter: saturate(1.2);
	}

	.richtlijn-criteria-2 {
		display: none;
	}

	:global(.richtlijn-uitleg.moeilijk .richtlijn-criteria-1) {
		display: none;
	}

	:global(.richtlijn-uitleg.moeilijk div.richtlijn-criteria-2) {
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
		.btn-top {
			display: none;
		}

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
