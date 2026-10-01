<script>
	// link to a server-rendered form page, so adding works without JavaScript
	import Icon from '$lib/components/atoms/icon.svelte';

	let { href, label } = $props();
</script>

<a {href} class="add-button" aria-label={label}>
	<Icon showIcon={true} iconName="add" />
</a>

<style>
	.add-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 3em;
		height: 3em;
		box-sizing: border-box;
		border-radius: var(--border-radius, 8px);
		background-color: var(--color-primary);
		color: var(--color-neutral-white);
		text-decoration: none;
	}

	.add-button:hover {
		filter: brightness(1.1);
	}

	.add-button:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 2px;
	}
</style>
