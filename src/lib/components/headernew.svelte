<script>
    import { onMount } from 'svelte';
	import LogoLightMobile from '$lib/components/LogoLightMobile.svelte';
	import BreadCrumbs from '$lib/components/breadCrumbs.svelte';
	import Hamburger from '$lib/components/hamburger.svelte';
	import LogoLightDesktop from '$lib/components/LogoLightDesktop.svelte';
	import homeIcon from '$lib/components/homeIcon.svelte';
	import loginIcon from '$lib/components/loginIcon.svelte';
	import darkmodeIcon from '$lib/components/darkmodeIcon.svelte';

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

	let isLightMode = $state(false);

	function toggleLightMode() {
		const savedLightMode = localStorage.getItem('lightMode');

		if (savedLightMode === null || savedLightMode === 'false') {
			isLightMode = true;
			document.body.classList.add('lightmode');
			localStorage.setItem('lightMode', `${isLightMode}`);
		} else {
			isLightMode = false;
			document.body.classList.remove('lightmode');
			localStorage.setItem('lightMode', `${isLightMode}`);
		}
	}

	async function handleSignOut(event) {
		event.preventDefault();
		await fetch('/logout', { method: 'POST' });
		window.location.href = '/login';
	}

	onMount(() => {
		const savedLightMode = localStorage.getItem('lightMode');

		if (savedLightMode === 'true') {
			isLightMode = true;
			document.body.classList.add('lightmode');
		} else {
			isLightMode = false;
			document.body.classList.remove('lightmode');
		}

		// const logoImage = document.getElementById('logoImage');
		// logoImage.src = isLightMode ? logoLightMode : logoDarkMode;

		const icon = document.querySelector('.disable-js');
		icon?.classList.toggle('disable-js');
	});
</script>

<header>
    <div class="header-wrapper">
        <a href="#main" class="sr-only">Jump directly to main content</a>

	    <a href="/" class="logo">
	    	<!-- <img
	    		src="{logo}"
	    		class="vvr-logo"
	    		id="logoImage"
	    	/> -->
				<LogoLightDesktop />
				<LogoLightMobile />
        </a>

        {#if user && user.isEmailGeverifieerd}
	    	<BreadCrumbs {params} {partners} {websites} {principes} />
	    {/if}

        <nav>
            <ul>
                {#if user && user.isEmailGeverifieerd}
                <li>
                    <a aria-label="home pagina" href="/">
	        	    	<homeIcon.svelte />
	        	    </a>
                </li>
                {/if} 
            
                {#if !user}
                <li>
	            	<a href="/login" aria-label="account">
	            		<loginIcon.svelte />
	            	</a>
                </li>
	            {/if}

                <li>
                    <a aria-label="lightmode button" class="disable-js" href=" ">
	                	<button aria-label="lightmode" class="toggle" onclick={toggleLightMode}>
	                		<darkmodeIcon.svelte />
	                	</button>
	                </a>
                </li>
            
	        	{#if user}
	        		<button onclick={handleSignOut} class="signout-btn">Sign out</button>
	        	{/if}
            </ul>
        </nav>
        <Hamburger />
    </div>
</header>

<style>
    .sr-only {
		clip: rect(1px, 1px, 1px, 1px);
		height: 0;
		overflow: hidden;
		color: white;
		position: absolute;
		white-space: nowrap;
		width: 0;
	}

	.sr-only:focus {
		clip: auto;
		height: auto;
		overflow: auto;
		position: absolute;
		width: auto;
	}

    header {
        display: flex;
        flex-direction: column;
        position: relative;
        padding: 1rem 0;
		overflow-x: clip;

        .header-wrapper {
            display: grid;
            grid-template-columns: 30% 40% 30%;
            grid-template-rows: 100%;
            justify-content: center;
            justify-items: center;
            align-items: center;
            margin: 0 1.25rem;

            .logo {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items:start;
				top: 1em;
                left: 1em;
				position: absolute;
				height: 75%;
				width: 30%;
				text-decoration: none;

				@media(min-width:768px) {
					height: auto;
					width: 30%;
					top: 20%;
				}
			}

            nav {
                display: none;
            }

			@media(min-width: 1260px) {
				grid-template-columns: 30% 60% 10%;
			}
        }

         &::after{
            content: "";
            margin-top: 1.25rem;
            aspect-ratio: 21.833;
            min-width: 450px;
            width: 100%;
            height: clamp(1.5rem, 5vw, 5rem);
            clip-path: shape(from 28.24% 100%,hline to 0%,vline to 94.74%,hline to 28.24%,curve to 37.66% 0% with 32.44% 94.74%/32.44% 0%,hline to 100%,vline to 5.26%,hline to 37.66%,curve to 28.24% 100% with 32.44% 5.26%/32.44% 100%,close);            background-color: #E30059;
        } 
    }
</style>