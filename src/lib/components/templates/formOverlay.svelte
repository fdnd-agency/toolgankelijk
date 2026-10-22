<script>
	// server-rendered overlay shown on top of the current page, closes with a link so it works without JavaScript
	import { goto } from '$app/navigation';
	import Icon from '$lib/components/atoms/icon.svelte';

	let { title, closeHref, children } = $props();

	let dialog = $state();

	// enhancement: with JavaScript the overlay becomes a real modal,
	// focus stays inside the dialog and the page behind it can't be reached
	$effect(() => {
		if (dialog.open) dialog.close();
		dialog.showModal();
	});

	function close() {
		goto(closeHref, { noScroll: true });
	}

	// Escape closes the modal by navigating back to the page without ?add
	function handleCancel(event) {
		event.preventDefault();
		close();
	}

	// a click outside the dialog box lands on the dialog itself (its ::backdrop)
	function handleClick(event) {
		const box = dialog.getBoundingClientRect();
		const outside =
			event.clientX < box.left ||
			event.clientX > box.right ||
			event.clientY < box.top ||
			event.clientY > box.bottom;
		if (event.target === dialog && outside) close();
	}
</script>

<div class="overlay">
	<!-- clicking next to the overlay closes it, keyboard users use the close link -->
	<a class="backdrop" href={closeHref} tabindex="-1" aria-hidden="true" data-sveltekit-noscroll></a>

	<dialog
		open
		bind:this={dialog}
		aria-labelledby="overlay-title"
		oncancel={handleCancel}
		onclick={handleClick}
	>
		<div class="overlay-heading">
			<h2 id="overlay-title">{title}</h2>
			<a class="close" href={closeHref} aria-label="Sluit het venster" data-sveltekit-noscroll>
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

	/* showModal() puts the dialog in the top layer, keep it centered there */
	dialog:modal {
		position: fixed;
		inset: 0;
		margin: auto;
		height: fit-content;
	}

	/* the .backdrop link already darkens and blurs the page */
	dialog::backdrop {
		background-color: transparent;
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
