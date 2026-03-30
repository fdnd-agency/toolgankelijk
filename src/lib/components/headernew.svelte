<script>
	import { onMount } from 'svelte';
 	import { page } from '$app/stores';
	import HomeIcon from './icons/homeIcon.svelte';
	import Logo from './logo/logo-header.svelte';
	import Navigation from './buttons/navigation.svelte';
	import AccountIcon from './icons/accountIcon.svelte';
	import InfoIcon from './icons/infoIcon.svelte';
	import BreadCrumbs from './breadCrumbs.svelte';
	import Hamburger from './hamburger.svelte';

	onMount(() => {
		const savedLightMode = localStorage.getItem('lightMode');

		if (savedLightMode === 'true') {
			isLightMode = true;
			document.body.classList.add('lightmode');
		} else {
			isLightMode = false;
			document.body.classList.remove('lightmode');
		}

		const icon = document.querySelector('.disable-js');
		icon?.classList.toggle('disable-js');
	});

	let { params, partners, websites, principes, user = null } = $props();
</script>

<header>
        <a href="#main" class="sr-only">Jump directly to main content</a>

	    <a href="/" class="logo-header">
			<Logo />
        </a>

		<nav id="header-navigation" class="color-primary-light">
			<Navigation size="large" icon={HomeIcon} title="Home" href="/" page="home" active={$page.url.pathname === '/' ? 'active' : ''} aria="Home"/>
			<Navigation size="large" icon={InfoIcon} title="Info" href="/info" page="info" active={$page.url.pathname === '/info' ? 'active' : ''} aria="Informatie pagina"/>
			<Navigation size="large" icon={AccountIcon} title="Account" href="/account" page="account" active={$page.url.pathname === '/account' ? 'active' : ''} aria="Mijn Account" />
		</nav>



		<Hamburger  />


        
		<!-- <div class="sign-button">
                {#if !user}
				<Navigation href="/login" icon={AccountIcon} title="Login" />
                	<li>
	            		<a href="/login" aria-label="account">
	            			
	            		</a>
                	</li>
	            {/if}

	        	{#if user}
					<Navigation href="/login" title="Sign Out" />
	        	{/if}
		</div> -->
</header>
<!-- <div class="subheader">
		{#if user && user.isEmailGeverifieerd}
			<BreadCrumbs {params} {partners} {websites} {principes} />
		{/if}
</div> -->

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
	justify-content: space-between;
}

.logo-header {
	text-decoration: none;
	padding: 1em;
}

#header-navigation {
	display: flex;
	gap: 1em;

	@media (max-width: 720px) {
		display: none;
	}
}



.subheader {
	height: 6em;
	width: 100vw;
	background-color: var(--color-primary-light);
	display: flex;
	align-items: center;
	padding-left: 5em;
}

</style>