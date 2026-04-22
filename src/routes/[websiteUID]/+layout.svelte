<script>
	let { children } = $props();
	import NavButton from '$lib/components/moleculues/navButton.svelte';
</script>

{@render children?.()}

<div class="scroll-to-top-wrapper">
	<NavButton size="small" variant="primary" showIcon={true} iconName="arrow" href="#main" aria="scroll naar boven">
	</NavButton>
</div>

<style>
	.scroll-to-top-wrapper {
		position: relative;
		padding: 1em;
		z-index: 3;
		transform: rotate(180deg);
	}
</style>
