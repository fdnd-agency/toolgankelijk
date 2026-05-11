<script>
    import { page } from '$app/stores';
    import NavButton from '../molecules/navButton.svelte';

    const menuId = "mobile-nav-menu";
</script>

<div class="hamburger-wrapper">
    <NavButton
        target={menuId}
        aria="open menu"
        showIcon={true}
        iconName="menu"
        variant="secondary"
        effect="header"
        size="small"
    />
</div>

<div popover="auto" id={menuId} class="hamburger-menu">
    <div class="menu-header">
        <NavButton
            target={menuId}
            action="hide"
            aria="close menu"
            showIcon={true}
            iconName="cross"
            variant="primary"
            size="small"
        />
    </div>
</div>

<style>
	.hamburger-wrapper {
		display: none;
		@media (max-width: 720px) {
			display: block;
		}
	}
</style>
