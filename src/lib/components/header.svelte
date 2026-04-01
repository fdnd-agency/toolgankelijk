<script>
	import { page } from '$app/stores';

	import Logo from './logoHeader.svelte';
	import BreadCrumbs from '$lib/components/breadCrumbs.svelte';
	import Hamburger from '$lib/components/hamburger.svelte';
	import NavButton from './NavButton.svelte';

	/**
	 * @typedef {Object} Props
	 * @property {any} params
	 * @property {any} partners
	 * @property {any} websites
	 * @property {any} principes
	 * @property {any} [user]
	 */

	/** @type {Props} */
	let { params, partners, websites, principes, user = null } = $props();

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
		<NavButton href="/" size="large" showIcon={true} iconName="home" variant="secondary" active={$page.url.pathname === '/' ? 'active' : ''} >
			<p>Home</p>
		</NavButton>
		<NavButton href="/info" size="large" showIcon={true} iconName="info" variant="secondary" active={$page.url.pathname === '/info' ? 'active' : ''} >
			<p>Info</p>
		</NavButton>
		<NavButton href="/account" size="large" showIcon={true} iconName="account" variant="secondary" active={$page.url.pathname === '/account' ? 'active' : ''} >
			<p>Account</p>
		</NavButton>
	</nav>
</header>

	<!-- <nav>
		<a href="/" aria-label="Ga naar het overzicht met alle partners">
		{#if user && user.isEmailGeverifieerd}
			<BreadCrumbs {params} {partners} {websites} {principes} />
		{/if}
		<div class="options">
			{#if user && user.isEmailGeverifieerd}
				<!-- <a aria-label="home pagina" href="/">
					<svg
						class="home-icon-img"
						alt="back to homepage"
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
					>
						<path
							d="M11.3 3.3a1 1 0 0 1 1.4 0l6 6 2 2a1 1 0 0 1-1.4 1.4l-.3-.3V19a2 2 0 0 1-2 2h-3a1 1 0 0 1-1-1v-3h-2v3c0 .6-.4 1-1 1H7a2 2 0 0 1-2-2v-6.6l-.3.3a1 1 0 0 1-1.4-1.4l2-2 6-6Z"
							id="my-svg4"
						/>
					</svg>
				</a> -->
				<!-- <a href="/login" aria-label="account">
					<svg
						class="account-icon-img"
						alt="account icon"
						width="800px"
						height="800px"
						viewBox="0 0 24 24"
						id="Layer_1"
						data-name="Layer 1"
						xmlns="http://www.w3.org/2000/svg"
					>
						<circle id="my-circle" class="cls-1" cx="12" cy="7.25" r="5.73" />
						<path
							id="my-svg2"
							class="cls-1"
							d="M1.5,23.48l.37-2.05A10.3,10.3,0,0,1,12,13h0a10.3,10.3,0,0,1,10.13,8.45l.37,2.05"
						/>
					</svg>
				</a> -->
			{/if}
			{#if user}
				<!-- signout button -->
			{/if}
		</div>
		<Hamburger />
	</nav> -->


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
		top: 0;
		display: flex;
		flex-direction: column;
		z-index: 1;
	}

	nav {
		display: flex;
		align-items: center;
		gap: 1rem;
		background-color: var(--c-background);
		padding: 1em;
		border-bottom: 2px solid #454545;
	}

	nav > a {
		z-index: 2;
	}

	.options {
		display: flex;
		align-items: center;
		gap: 0.8rem;
		margin-left: auto;
		z-index: 2;
	}

	.options svg {
		fill: var(--c-white2);
	}

	.account-icon-img {
		width: 2rem;
		height: 1.6rem;
	}

	.home-icon-img {
		width: 2.2rem;
		height: 2rem;
	}

	@media print {
		.vvr-logo {
			display: none;
		}

		.options {
			display: none;
		}
	}

	@media only screen and (max-width: 990px) {
		nav {
			display: grid;
			grid-template-rows: auto;
			gap: 0.4rem;
		}
		nav > a,
		.options {
			grid-row: 1;
		}
	}
</style>
