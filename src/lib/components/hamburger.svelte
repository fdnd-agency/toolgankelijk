<script>
 	import { page } from '$app/stores';
    import MenuIcon from './icons/menuIcon.svelte';
	import HomeIcon from './icons/homeIcon.svelte';
	import AccountIcon from './icons/accountIcon.svelte';
	import InfoIcon from './icons/infoIcon.svelte';
	import Navigation from './buttons/navigation.svelte';
	import CrossIcon from './icons/crossIcon.svelte';
</script>

    <div class="hamburger-button">
        <Navigation href="#main-nav" icon={MenuIcon} size="small"/>
    </div>

	<nav id="main-nav">
        <div class="hamburger-button-close">
            <Navigation size="small" icon={CrossIcon} href="#" />
        </div>
        <ul class="navigation-hamburgermenu">
            <li> <Navigation size="large" icon={HomeIcon} title="Home" href="/" page="home" active={$page.url.pathname === '/' ? 'active' : ''}/> </li>
            <li> <Navigation size="large" icon={InfoIcon} title="Info" href="/info" page="info" active={$page.url.pathname === '/info' ? 'active' : ''}/> </li>
            <li> <Navigation size="large" icon={AccountIcon} title="Account" href="/account" page="account" active={$page.url.pathname === '/account' ? 'active' : ''} /> </li>
        </ul>
	</nav>

<style>
#main-nav {
    display: none; 
    position: absolute;
    background-color: var(--color-primary-light);
    top: 0;
    right: 0;
    width: 50%;
    height: 100vh;
    padding-top: 5em;
    z-index: 10;
    padding-top: 3em;
    padding-left: 1em;

    @media (max-width: 720px){
        display: none;
    }

    ul {
        display: flex;
        flex-direction: column;
        gap: 1em;
        list-style: none;
        padding: 0;
        margin: 0;
    }

    &:target {
        display: block;
	}
}

.hamburger-button {
    display: none;

    @media (max-width: 720px) {
        display: block;
    }
}

.hamburger-button-close {
    position: absolute;
    right: 1em;
}
</style>