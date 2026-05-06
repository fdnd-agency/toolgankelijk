<script>
	import { page } from '$app/state';
	import NavButton from '$lib/components/molecules/navButton.svelte';
</script>

<section>
	<h1>{page.status}: {page.error.message}</h1>

	<div class="content-container">
		<h2><span>Oeps!</span> Er is iets mis gegaan.</h2>
		<p>
			De pagina die je zoekt, is helaas niet gevonden. Misschien heb je een verkeerde afslag genomen
			of is er iets misgegaan tijdens het navigeren van onze tool. Probeer het opnieuw om op de juiste
			pagina te belanden.
		</p>
		<NavButton href="/" showIcon={true} iconName="home"></NavButton>
	</div>
</section>



<style>
	section {
		display: flex;
		gap: 1rem;
		align-items: center;
		background-color: var(--c-container);
		padding: 2em;
		border-top: 12px solid var(--c-pink);
		margin: 1em 0.75em;
		border-radius: 0.5em;
	}

	.content-container {
		gap: 1rem;
		background-color: var(--c-container);
		padding: 2em;
		margin: 1em 0.75em;
		border-radius: 0.5em;
	}
</style>