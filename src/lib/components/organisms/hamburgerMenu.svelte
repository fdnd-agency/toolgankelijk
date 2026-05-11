<script>
	import NavButton from '../molecules/navButton.svelte';
</script>

<div class="hamburger-wrapper">
	<NavButton
		href="#footer"
		aria="open menu"
		showIcon={true}
		iconName="menu"
		variant="secondary"
		effect="header"
		size="small"
	></NavButton>
</div>

<style>
	.hamburger-wrapper {
		display: none;
		@media (max-width: 720px) {
			display: block;
		}
	}
</style>
