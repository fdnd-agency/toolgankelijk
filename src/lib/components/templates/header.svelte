<script>
	import { page } from '$app/stores';
	import Logo from '../atoms/logoHeader.svelte';
	import Hamburger from '$lib/components/organisms/hamburgerMenu.svelte';
	import NavButton from '../molecules/navButton.svelte';
</script>

<header>

	<!-- button for fast forwards to the main content -->
	<NavButton 
		effect="invisible" 
		href="#main">
		Jump directly to main content
	</NavButton>

	<Logo />

	<nav class="header-navigation">
		<div class="header-navigation-wrapper">
			<NavButton
				href="/"
				size="large"
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
				size="large"
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
				size="large"
				showIcon={true}
				iconName="account"
				effect="header"
				variant="secondary"
				active={$page.url.pathname === '/account' ? 'active' : ''}
			>

				<p>Account</p>
			</NavButton>
		</div>
	</nav>

	<Hamburger />
</header>

<style>
	header {
		width: 100vw;
		height: 15vh;
		background-color: var(--color-primary);
		display: flex;
		align-items: center;
		gap: 1em;
		padding-left: 5%;
		padding-right: 5%;
	}

	.header-navigation {
		display: flex;
		justify-content: space-between;
		width: 100%;

		@media (max-width: 720px) {
			display: none;
		}
	}

	.header-navigation-wrapper {
		display: flex;
		place-items: flex-end;
		gap: 1em;
	}
</style>
