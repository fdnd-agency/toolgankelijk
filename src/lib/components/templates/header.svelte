<script>
	import { page } from '$app/stores';

	import Logo from '../atoms/logoHeader.svelte';
	import BreadCrumbs from '$lib/components/organisms/breadCrumbs.svelte';
	import Hamburger from '$lib/components/organisms/hamburgerMenu.svelte';
	import NavButton from '../moleculues/navButton.svelte';

	/**
	 * @typedef {Object} Props
	 * @property {any} params
	 * @property {any} partners
	 * @property {any} websites
	 * @property {any} principles
	 * @property {any} [user]
	 */

	/** @type {Props} */
	let { params, partners, websites, principles, user = null } = $props();

	async function handleSignOut(event) {
		event.preventDefault();
		await fetch('/logout', { method: 'POST' });
		window.location.href = '/login';
	}
</script>

<header>
	<a href="#main" class="visible-hidden">Jump directly to main content</a>
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
<div class="subheader">
	{#if user && user.isEmailVerified}
		<BreadCrumbs {params} {partners} {websites} {principles} width="full" />
	{/if}
</div>

<style>
	.visible-hidden {
		clip: rect(1px, 1px, 1px, 1px);
		height: 1px;
		overflow: hidden;
		color: white;
		position: absolute;
		white-space: nowrap;
		width: 1px;
	}

	.visible-hidden:focus {
		clip: auto;
		height: auto;
		overflow: auto;
		position: absolute;
		width: auto;
	}

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

	.subheader {
		height: fit-content;
		background-color: var(--color-primary-light);
		display: flex;
		padding: 1em;
		align-content: center;
	}

	#header-navigation {
		display: flex;
		gap: 1em;

		@media (max-width: 720px) {
			display: none;
		}
	}
</style>
