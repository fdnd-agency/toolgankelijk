<script>
	import { enhance } from '$app/forms'
	import Heading from '$lib/components/heading.svelte';
	import walking from '$lib/assets/walking_together.svg';
	import knowledge from '$lib/assets/sharing_knowledge.svg';

    export let data 

	$: heading = { titel: 'Informatie' };


</script>

<Heading {heading} />

<div class="content-container">
	<section class="top-container">
		<section class="text-container">
			<h3><span>Vervoerregio Amsterdam.</span> HvA</h3>
			<br />
			<p>
				Wij hebben samen met studenten van de Hogeschool van Amsterdam een checklist ontwikkeld
				waarin op eenvoudige wijze wordt uitgelegd wat hierbij komt kijken en welke stappen u kunt
				nemen om uw website en app toegankelijk te maken.
			</p>
		</section>
		<section class="image-container">
			<img src={walking} class="text-image" alt="darkmode icon" />
		</section>
	</section>

	<section class="left-container">
		<h3 id="wettelijk">is uw website al toegankelijk?</h3>
		<br />
		<p>
			Binnen 2025 moet dit al! Voor overheden is dit al verplicht. En vanaf 2025 moet iedere nieuwe
			website en app digitaal toegankelijk zijn. Dit moet volgens het EAA (European Accessibility
			Act). Dit zou er mee moeten helpen dat iedereen elke website zou kunnen bezoeken, niet
			uitmakende dat iemand een beperking heeft
		</p>
	</section>

	<section class="right-container">
		<h3>Wat kunt u doen om uw website toegankelijk te maken?</h3>
		<br />
		<p>
			De Vervoerregio Amsterdam heeft samen met studenten van de Hogeschool van Amsterdam een
			checklist ontwikkeld waarin op eenvoudige wijze wordt uitgelegd wat hierbij komt kijken en
			welke stappen u kunt nemen om uw website en app toegankelijk te maken.
		</p>
	</section>

	<section class="bot-left-container">
		<section class="text-container">
			<h3>Wat is de wettelijke achtergrond?</h3>
			<br />
			<p>
				In Nederland zijn er ca. 2 miljoen mensen met een beperking. Als deze mensen uw website of
				app niet kunnen gebruiken, dan zorgt dat dat deze mensen worden uitgesloten van de
				samenleving. Medio 2025 wordt om die reden door.
				<br /><br />
				De Europese Unie de European Accessibility Act (EAA) of Europese Toegankelijkheidswet ingevoerd.
				De wet zorgt ervoor dat digitale barrières worden verwijderd voor mensen met een beperking. De
				eisen zijn gebaseerd op de Web Content Accessibility Guidelines (WCAG) van het World Wide Web
				Consortium
			</p>
		</section>
		<section class="image-container">
			<img src={knowledge} class="text-image" alt="Sharing Knowledge" />
		</section>
	</section>

	<section class="bot-right-container">
		<section class="text-container">
			<h3>Contact opnemen?</h3>
			<br />
			<p>
				Indien u vragen heeft of mocht er nog enige onduidelijkheid bestaan, kunt u via 
                onderstaand formulier contact met ons opnemen.
			</p>
            <form action="/info" method="POST">
                <fieldset class="form-vraag">
                <label for="name">Naam</label>
                <input id="name" placeholder="name" type="text" name="name" required />
                <label for="mail">Email</label>
                <input placeholder="email" id="mail" type="email" name="email" required />
                <label for="vraag">Uw vraag</label>
                <textarea id="vraag" name="vraag" required rows="3"></textarea>
                <button class="form-button" type="submit">Submit</button>
                </fieldset>
            </form>
		</section>
	</section>
</div>

<style>

	.text-container p {
		max-width: 50rem;
	}

	.top-container {
		grid-area: top;
		display: flex;
		align-items: flex-start;
		justify-content: flex-start;
        /* height: 20rem; */
	}

	.left-container {
		grid-area: left;
        /* height: 13rem; */
	}

	.right-container {
		grid-area: right;
        /* height: 13rem; */
	}

	.bot-left-container {
		grid-area: botleft;
		display: flex;
		align-items: flex-start;
		justify-content: flex-start;
	}

	.bot-right-container {
		grid-area: botright;
		display: flex;
		align-items: flex-start;
		justify-content: flex-start;
	}

	.content-container {
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-template-rows: .3fr .5fr 1fr 1fr;
		grid-template-areas:
			'top top' 
			'left right'
			'botleft botright';
		margin: 1em 1em;
		gap: 1em;
	}

	.text-image {
		height: 13em;
	}

	.top-container,
	.left-container,
	.right-container,
	.bot-left-container,
	.bot-right-container {
		padding: 2em;
		background-color: var(--c-container);
		/* border-top: 12px solid var(--c-pink); */
		border-radius: 0.5em;
	}

	span {
		color: var(--c-pink);
	}

	/* .text-container {
    max-width: 50em;
} */

	.image-container {
		margin-left: auto;
		align-self: center;
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
		background-color: var(--c-container-stroke);
		border: none;
		height: 2.5rem;
		width: 15rem;
		padding-left: 0.5rem;
		color: white;
		font-size: 16px;
        margin-bottom: .7rem;
	}

	input:valid {
		border: 1px solid lightgreen;
		transition: .3s ease-out;
	}

	/* input:invalid {
		border: 1px solid red;
	} */

    textarea {
        background-color: var(--c-container-stroke);
		border: none;
		height: 4rem;
		width: 15rem;
		padding-left: 0.5rem;
		color: white;
		font-size: 16px;
    }

	form:valid .form-button {
		background-color: var(--c-pink);
		border: 2px solid var(--c-pink);
	}

    .form-button {
        margin-top: 1rem;
		margin-bottom: 1rem;
		background-color: grey;
		color: lightgray;
		border: 2px solid grey;
		width: 10rem;
		height: 2.5rem;
		border-radius: 20px;
		cursor: pointer;
		transition: 0.2s ease-in-out;
		font-size: 16px; 
    }

    .form-button:hover {
        background-color: transparent !important;
    }

	@media only screen and (max-width: 1100px) {
		.content-container {
			grid-template-columns: 1fr;
			grid-template-rows: 1fr 1fr 1fr 1fr;
			grid-template-areas:
				'top'
				'left'
				'right'
				'botleft'
                'botright';
		}

		.text-image {
			height: 10em;
		}
	}
</style>
