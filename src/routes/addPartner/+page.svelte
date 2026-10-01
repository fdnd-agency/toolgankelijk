<script>
	// server-side page to add a partner, works without JavaScript
	import PartnerForm from '$lib/components/organisms/partnerForm.svelte';

	let { form } = $props();
</script>

<section class="content-container">
	<article class="tip-container">
		<p class="tip">Tip</p>
		<p>Probeer een partner toe te voegen die nog niet in de lijst bestaat!</p>
	</article>

	<PartnerForm />
</section>

{#if form?.message}
	<div class="toast" role="status"><p>{form.message}</p></div>
{/if}

<style>
	.content-container {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: flex-start;
		gap: 0.5em;
		margin: 0.5em 5%;
	}

	article {
		background-color: var(--color-background-card);
		color: var(--color-neutral-black);
		border-radius: var(--border-radius, 8px);
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
		padding: 1.2em;
	}

	.tip {
		color: var(--color-primary);
		font-weight: bold;
		line-height: 1.5em;
	}

	.toast {
		position: fixed;
		bottom: 5rem;
		right: 1rem;
		min-width: 10rem;
		background-color: var(--color-primary-light);
		color: var(--color-neutral-black);
		border: 1px solid var(--color-primary);
		border-radius: 4px;
		padding: 0.5rem;
		animation: fade-out 4s forwards;
		z-index: 2;
	}

	@keyframes fade-out {
		from {
			transform: translateX(30vh);
			display: block;
		}
		10% {
			transform: translateX(0);
			display: block;
		}
		80% {
			transform: translateX(0);
			display: block;
		}
		to {
			transform: translateX(30vh);
			display: none;
		}
	}

	@media (max-width: 850px) {
		.content-container {
			flex-wrap: wrap;
		}
	}
</style>
