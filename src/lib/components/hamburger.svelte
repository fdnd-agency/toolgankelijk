<script>
	import NavButton from './NavButton.svelte';
</script>

<div class="hamburger-wrapper">
	<NavButton href="#footer" aria="open menu" showIcon={true} iconName="menu" variant="secondary" size="small">
	</NavButton>
</div>

<style>
.hamburger-wrapper {
	display: none;
	@media (max-width: 720px) {
		display: block;
	}
}
</style>