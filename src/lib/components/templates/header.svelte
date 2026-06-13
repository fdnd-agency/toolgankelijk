<script>
	import { page } from '$app/stores';
	import Logo from '../atoms/logoHeader.svelte';
	import Hamburger from '$lib/components/organisms/hamburgerMenu.svelte';
	import NavButton from '../molecules/navButton.svelte';

	export let user
</script>

<header>

	<Logo />

	<NavButton effect="invisible" href="#main">Jump directly to main content</NavButton>

	<nav class="header-navigation">
		<div class="header-navigation-wrapper">
			<NavButton
				href="/"
				showIcon={true}
				iconName="home"
				variant="secondary"
				effect="header"
				active={$page.url.pathname === '/' ? 'active' : ''}
			>
				<p>Home</p>
			</NavButton>

			<NavButton
				href="/info"
				showIcon={true}
				iconName="info"
				variant="secondary"
				effect="header"
				active={$page.url.pathname === '/info' ? 'active' : ''}
			>
				<p>Info</p>
			</NavButton>
		</div>

		<div class="account-button">
			<NavButton
				href="/account"
				showIcon={true}
				iconName="account"
				effect="header"
				variant="secondary"
				active={$page.url.pathname === '/account' ? 'active' : ''}
			>
				<p>{user}</p>
			</NavButton>
		</div>
	</nav>

	<Hamburger />
</header>

<style>
	header {
		width: 100%;
		box-sizing: border-box;
		height: 15vh;
		background-color: var(--color-primary);
		display: flex;
		align-items: center;
		gap: 1em;
		padding: 0 5%;
	}

	.header-navigation {
		display: flex;
		justify-content: space-between;
		width: 100%;
		margin-left: 4em;
		

		@media (max-width: 720px) {
			display: none;
		}
	}

	.header-navigation-wrapper {
		display: flex;
		align-items: center;
		gap: 2em;

	}

	p {
        margin: 0;
        padding: 0;
    }
</style>
