<script>
	// server-rendered overlay shown on top of the current page, closes with a link so it works without JavaScript
	import Icon from '$lib/components/atoms/icon.svelte';

	let { title, closeHref, children } = $props();
</script>

<div class="overlay">
	<!-- clicking next to the overlay closes it, keyboard users use the close link -->
	<a class="backdrop" href={closeHref} tabindex="-1" aria-hidden="true"></a>

	<dialog open aria-labelledby="overlay-title">
		<div class="overlay-heading">
			<h2 id="overlay-title">{title}</h2>
			<a class="close" href={closeHref} aria-label="Sluit het venster">
				<Icon showIcon={true} iconName="cross" />
			</a>
		</div>

		{@render children?.()}
	</dialog>
</div>

<style>
	.overlay {
		position: fixed;
		inset: 0;
		z-index: 10;
		display: grid;
		place-items: center;
		padding: 1em;
	}

	.backdrop {
		position: absolute;
		inset: 0;
		background-color: rgba(44, 44, 44, 0.75);
		backdrop-filter: blur(0.5rem);
	}

	dialog {
		position: relative;
		width: min(100%, 45em);
		box-sizing: border-box;
		margin: 0;
		padding: 2em;
		border: none;
		border-radius: var(--border-radius, 8px);
		background-color: var(--color-background-card);
		color: var(--color-neutral-black);
	}

	.overlay-heading {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 1em;
		margin-bottom: 1.5em;
	}

	h2 {
		margin: 0;
	}

	.close {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 3em;
		height: 3em;
		color: var(--color-neutral-black);
		border-radius: var(--border-radius, 8px);
	}

	.close:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 2px;
	}
</style>
