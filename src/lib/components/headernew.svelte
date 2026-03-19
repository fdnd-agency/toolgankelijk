<script>
	import HomeIcon from '$lib/components/homeIcon.svelte';
	import SignoutButton from '$lib/components/signoutButton.svelte';
	import InfoIcon from '$lib/components/infoIcon.svelte';
	import Hamburger from '$lib/components/hamburger.svelte';
	import LogoLightDesktop from '$lib/components/LogoLightDesktop.svelte';
	import loginIcon from '$lib/components/loginIcon.svelte';
	import CloseMenu from '$lib/components/CloseMenu.svelte';
	import AccountIcon from './accountIcon.svelte';
	import { onMount } from 'svelte';
	import LogoLightMobile from './LogoLightMobile.svelte';


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
	let { user = null } = $props();
</script>

<header>
        <a href="#main" class="sr-only">Jump directly to main content</a>

	    <a href="/" class="logo">
			<LogoLightMobile />
        </a>

        <nav id="main-nav">
            <ul>
				<li>
					<a href="/" aria-label="home">
						<HomeIcon />
						<p>Home</p>
					</a>
				</li>

				<li>
					<a href="/info" aria-label="information page">
						<InfoIcon />
						<p>Info</p>
					</a>
				</li>

				<li>
					<a href="/account">
						<AccountIcon/>
						<p>{ user.gebruikersnaam }</p>
					</a>
				</li>
            
                {#if !user}
                	<li>
	            		<a href="/login" aria-label="account">
	            			<loginIcon.svelte />
	            		</a>
                	</li>
	            {/if}

	        	{#if user}
	        		<SignoutButton />
	        	{/if}
            </ul>
        </nav>
        <Hamburger />
		<CloseMenu />
</header>

<style>

</style>