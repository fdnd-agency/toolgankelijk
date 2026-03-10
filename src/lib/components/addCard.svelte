<script>
	// open the add url or add partner
	import Dialog from '$lib/components/dialog.svelte';
	import AddButton from '$lib/components/icons/addButton.svelte';

	const { isUrl } = $props();

	let dialogRef = $state();
	let url;

	function handleDialog() {
		dialogRef.open();
	}
</script>

{#if isUrl}
<Dialog bind:this={dialogRef} isType="addUrl"/>
<article class="card-add">
	<button onclick={handleDialog} isType="addUrl">
		<!-- two way binding in the button with the add url/partner element -->
		<AddButton />
	</button>
	<h2>Add URL </h2>
</article>
{:else}
<Dialog bind:this={dialogRef} isType="addPartner"/>
<article class="card-add">
	<button onclick={handleDialog} isType="addPartner">
		<!-- two way binding in the button with the add url/partner element -->
		<AddButton />
	</button>
	<h2>Add Partner </h2>
</article>
{/if}



<style>
	.card-add {
		width: 100%;
		height: 100%;
		background-color: var(--color-primary-light);
		color: var(--color-neutral-black);
		border-radius: var(--border-radius);
		display: flex;
		justify-content: center;
		flex-direction: column;
		align-items: center;
		gap: 1em;
		opacity: 0.8;
		padding: 2em;

		&:hover {
			transition-duration: 0.3s;
			opacity: 1;
		}
	}

	button {
		background: none;
		color: inherit;
		border: none;
		padding: 0;
		font: inherit;
		cursor: pointer;
		outline: inherit;
	}
</style>