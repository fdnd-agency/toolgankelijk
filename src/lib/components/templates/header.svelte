<script>
	import { page } from '$app/stores';

	import Logo from '../atoms/logoHeader.svelte';
	import BreadCrumbs from '$lib/components/organisms/breadCrumbs.svelte';
	import Hamburger from '$lib/components/organisms/hamburgerMenu.svelte';
	import NavButton from '../molecules/navButton.svelte';

	let { params, partners, websites, principles, user = null } = $props();
</script>

<header>
	<NavButton effect="invisible" href="#main">Jump directly to main content</NavButton>

	<Logo />
	<nav id="header-navigation" class="color-primary-light">
		<NavButton
			href="/"
			size="large"
			showIcon={true}
			iconName="home"
			variant="secondary"
			active={$page.url.pathname === '/' ? 'active' : ''}
		>
			<p>Home</p>
		</NavButton>
		<NavButton
			href="/info"
			size="large"
			showIcon={true}
			iconName="info"
			variant="secondary"
			active={$page.url.pathname === '/info' ? 'active' : ''}
		>
			<p>Info</p>
		</NavButton>
		<NavButton
			href="/account"
			size="large"
			showIcon={true}
			iconName="account"
			variant="secondary"
			active={$page.url.pathname === '/account' ? 'active' : ''}
		>
			<p>Account</p>
		</NavButton>
	</nav>
	<Hamburger />
</header>

<style>
	header {
		position: sticky;
		padding-left: 1em;
		padding-right: 1em;
		width: 100vw;
		height: 15vh;
		background-color: var(--color-primary);
		display: flex;
		align-items: center;
		justify-content: space-around;
	}

	#header-navigation {
		display: flex;
		gap: 1em;

		@media (max-width: 720px) {
			display: none;
		}
	}
</style>
