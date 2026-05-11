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

    <nav>
        <NavButton
            href="/"
            target={menuId}
            action="hide"
            size="large"
            showIcon={true}
            iconName="home"
            variant="primary"
            effect="full"           
            active={$page.url.pathname === '/' ? 'active' : ''}
        >
            <p>Home</p>
        </NavButton>

        <NavButton
            href="/info"
            target={menuId}
            action="hide"
            size="large"
            showIcon={true}
            iconName="info"
            variant="primary"
            effect="full"
            active={$page.url.pathname === '/info' ? 'active' : ''}
        >
            <p>Info</p>
        </NavButton>

        <NavButton
            href="/account"
            target={menuId}
            action="hide"
            size="large"
            showIcon={true}
            iconName="account"
            effect="full"
            variant="primary"
            active={$page.url.pathname === '/account' ? 'active' : ''}
        >
            <p>Account</p>
        </NavButton>
    </nav>
</div>

<style>
	.hamburger-wrapper {
		display: none;
		@media (max-width: 720px) {
			display: block;
		}
	}
</style>
