<script>
	import { enhance } from '$app/forms';
	import walking from '$lib/assets/walking_together.svg';
	import knowledge from '$lib/assets/sharing_knowledge.svg';
	import NavButton from '$lib/components/molecules/navButton.svelte';
	import Heading from '$lib/components/molecules/heading.svelte';

	let heading = $derived({ titel: 'Informatie' });

	let isSubmitting = $state(false);
	let successMessage = $state('');
	let errorMessage = $state('');

	function handleEnhance({ formElement }) {
		const handleSubmit = async ({ result }) => {
			isSubmitting = false;
			successMessage = 'Verzonden!';

			if (result.type === 'failure') {
				errorMessage = 'Er is iets fout gegaan';
				errorMessage = result.data.data.error;
			} else {
				formElement.reset();
				successMessage = result.data.data.message;
			}
		};
		return handleSubmit;
	}
</script>

<Heading {heading} />

<div class="info-wrapper">
	<section class="text-container">
		<h2><span>Vervoerregio Amsterdam</span> HvA</h2>
		<br />
		<p>
			Wij hebben samen met studenten van de Hogeschool van Amsterdam een praktische en
			overzichtelijke checklist ontwikkeld. In deze checklist wordt op een eenvoudige en
			begrijpelijke manier uitgelegd wat er komt kijken bij digitale toegankelijkheid van websites
			en apps. Daarnaast biedt de checklist concrete handvatten en duidelijke stappen die u kunt
			nemen om uw website en app toegankelijker te maken voor alle gebruikers, inclusief mensen met
			een beperking. Op deze manier kunt u stap voor stap werken aan een gebruiksvriendelijke,
			inclusieve en beter toegankelijke digitale omgeving.
		</p>
	</section>

	<section class="text-container">
		<img src={walking} class="text-image" alt="darkmode icon" />
		<div class="text-subcontainer text-subcontainer--light">
			<h2 id="wettelijk">Is uw website al toegankelijk?</h2>
			<p>
				Binnen 2025 moet dit al! Voor overheden is dit al verplicht. En vanaf 2025 moet iedere
				nieuwe website en app digitaal toegankelijk zijn. Dit moet volgens het EAA (European
				Accessibility Act). Dit zou er mee moeten helpen dat iedereen elke website zou kunnen
				bezoeken, niet uitmakende dat iemand een beperking heeft.
			</p>
		</div>
	</section>

	<section class="text-container">
		<div class="text-subcontainer text-subcontainer--dark">
			<h3>Wat kunt u doen om uw website toegankelijk te maken?</h3>

			<p>
				De Vervoerregio Amsterdam heeft samen met studenten van de Hogeschool van Amsterdam een
				praktische checklist ontwikkeld waarin op een eenvoudige en toegankelijke manier wordt
				uitgelegd wat er komt kijken bij het digitaal toegankelijk maken van websites en apps.
				Daarnaast beschrijft de checklist welke stappen organisaties kunnen nemen om hun website en
				app toegankelijker en gebruiksvriendelijker te maken voor een brede groep gebruikers,
				waaronder mensen met een beperking.
			</p>
		</div>
	</section>

	<section class="text-container">
		<img src={knowledge} class="text-image" alt="Sharing Knowledge" />
		<div class="text-subcontainer">
			<h2>Wat is de wettelijke achtergrond?</h2>
			<p>
				In Nederland zijn er ca. 2 miljoen mensen met een beperking. Als deze mensen uw website of
				app niet kunnen gebruiken, dan zorgt dat dat deze mensen worden uitgesloten van de
				samenleving. Medio 2025 wordt om die reden door.

				<br />
				<br />
				De Europese Unie de European Accessibility Act (EAA) of Europese Toegankelijkheidswet ingevoerd.
				De wet zorgt ervoor dat digitale barrières worden verwijderd voor mensen met een beperking. De
				eisen zijn gebaseerd op de Web Content Accessibility Guidelines (WCAG) van het World Wide Web
				Consortium
			</p>
		</div>
	</section>

	<section class="text-container">
		<h2>Contact opnemen?</h2>
		<p>
			Indien u vragen heeft of mocht er nog enige onduidelijkheid bestaan, kunt u via onderstaand
			formulier contact met ons opnemen.
		</p>
		<div class="text-subcontainer">
			<form
				action="/info"
				use:enhance={handleEnhance}
				onsubmit={() => (isSubmitting = true)}
				method="POST"
			>
				<fieldset class="form-vraag">
					<label for="name">Naam</label>
					<input id="name" placeholder="naam" type="text" name="name" required />
					<label for="mail">Email</label>
					<input placeholder="email" id="email" type="email" name="email" required />
					<label for="vraag">Uw vraag</label>
					<textarea id="vraag" name="vraag" placeholder="Bericht..." required rows="3"></textarea>
					<NavButton aria="Verzend Vraag" type="submit" size="medium" variant="secondary">
						Verstuur
					</NavButton>

					{#if successMessage}
						<p class="success-message">{successMessage}</p>
					{/if}

					{#if errorMessage}
						<p class="error-message">{errorMessage}</p>
					{/if}
				</fieldset>
			</form>
		</div>
	</section>
</div>

<style>
	.info-wrapper {
		display: flex;
		flex-direction: column;
		gap: 2em;
	}

	.text-container {
		height: 45vh;
	}

	.text-container:nth-of-type(1) {
		color: #470026;
		background-color: white;
	}

	.text-container:nth-of-type(2) {
		color: #ffffff;
		background-color: #7a8f0b;
		display: flex;
		align-items: center;
		gap: 2rem;
	}

	.text-container:nth-of-type(3) {
		color: #470026;
		background-color: white;
		display: flex;
		align-items: center;
		gap: 2rem;
	}

	.text-container:nth-of-type(4) {
		display: flex;
		align-items: center;
		background-color: #0084c8;
	}

	.text-container:nth-of-type(5) {
		display: flex;
		align-items: left;
		flex-direction: column;
		background-color: #ffffff;
		color: #470026;
	}

	form {
		padding-top: 1.5rem;
	}

	.text-container p {
		max-width: 50rem;
	}

	.text-image {
		height: 13em;
		width: 30%;
	}

	.text-container {
		padding: 2em;
		color: var(--color-neutral-white);
		background-color: var(--color-primary);
		height: 40vh;
	}

	.text-subcontainer {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.text-subcontainer h3 {
		font-weight: 700;
	}

	.text-subcontainer--light {
		color: #ffffff;
	}

	.text-subcontainer--dark {
		color: #470026;
	}

	.form-vraag {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		width: 18rem;
		background-color: var(--c-container);
		border: none;
		border-radius: 10px;
		padding-right: 2rem;
		padding-top: 1rem;
		padding-bottom: 1.5rem;
	}

	input {
		background-color: var(--color-background-card);
		border: none;
		height: 2.5rem;
		width: 15rem;
		padding-left: 0.5rem;
		color: white;
		font-size: 16px;
		margin-bottom: 0.7rem;
	}

	input:valid {
		border: 1px solid lightgreen;
		transition: 0.3s ease-out;
	}

	textarea:valid {
		border: 1px solid lightgreen;
		transition: 0.2s ease-out;
	}

	textarea {
		background-color: var(--color-background-card);
		border: none;
		height: 4rem;
		width: 15rem;
		padding-left: 0.5rem;
		color: white;
		font-size: 16px;
	}

	.success-message {
		color: green;
	}
	.error-message {
		color: red;
	}
	
	:global(.navbutton) {
		background-color: #B9005F !important;
		color: #FFFFFF !important;
	}
</style>
