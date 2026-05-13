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
        effect="hamburger"
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
            position: absolute;
            right: 5%;
        }
    }

    .hamburger-menu {
        display: none;
        border: none;
        padding: 0;
    }

     @supports selector(:popover-open) {
        .hamburger-menu {
            display: fixed;
            height: 100dvh;
            width: 100%;
            z-index: 100;
            margin: 0;
            inset: 0;
            padding: 1.5em;
            inset: 6.2em 0 0 auto;
            background-color: var(--color-primary-light);

            transition: 
                translate 0.4s ease, 
                display 0.4s allow-discrete, 
                overlay 0.4s allow-discrete;
        
            translate: 100% 0;

            @media (min-width: 720px) {
                display: none;
            }
        }
    }

    .hamburger-menu:popover-open {
        translate: 0 0;
        display: block;
    }

    @starting-style {
            .hamburger-menu:popover-open {
                translate: 100% 0;
        }
    }

    .menu-header {
        display: flex;
        justify-content: flex-end; 
        margin-bottom: 2rem;
    }

    nav {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        width: 100%;
    }

    .hamburger-menu::backdrop {
        background-color: var(--color-neutral-black);
        opacity: 0.3;
    }
</style>