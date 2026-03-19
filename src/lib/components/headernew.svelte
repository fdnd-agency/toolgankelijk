<script>
	import { onMount } from 'svelte';
	import LogoLightMobile from './LogoLightMobile.svelte';
	import HomeIcon from './icons/homeIcon.svelte';
	import Button from './buttons/button.svelte'
	import Navigation from './buttons/navigation.svelte'
	import AccountIcon from './icons/accountIcon.svelte';



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

        <nav class="header-navigation">
			<Navigation icon={HomeIcon} title="Home" href="/" />
			<Navigation icon={HomeIcon} title="Info" href="/info" />
			<Navigation icon={AccountIcon} title="Account" href="/account" />
		</nav>
            
                {#if !user}
				<Navigation href="/login" icon={AccountIcon} title="Login" />
                	<li>
	            		<a href="/login" aria-label="account">
	            			
	            		</a>
                	</li>
	            {/if}

	        	{#if user}
					<Navigation href="/login" icon={AccountIcon} title="Sign Out" />
	        	{/if}
</header>

<style>

header {
	position: sticky;
	width: 100vw;
	height: 120px;
	background-color: var(--color-primary);
}

.header-navigation {
	display: flex;
	gap: 1em;
}

</style>