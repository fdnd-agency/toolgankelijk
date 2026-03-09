<script>
	import AddButton from '$lib/components/icons/addButton.svelte';
</script>


<article class="card-add">
	<AddButton />
	<h2>Add Partner</h2>
</article>

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
</style>