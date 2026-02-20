<script>
    import { onMount } from 'svelte';
	import LogoLightMobile from '$lib/components/LogoLightMobile.svelte';
	import BreadCrumbs from '$lib/components/breadCrumbs.svelte';
	import Hamburger from '$lib/components/hamburger.svelte';
	import LogoLightDesktop from '$lib/components/LogoLightDesktop.svelte';

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

	    <a href="/" aria-label="Ga naar het overzicht met alle partners" class="logo">
	    	<!-- <img
	    		src="{logo}"
	    		class="vvr-logo"
	    		id="logoImage"
	    		alt="Logo van Vervoerregio Amsterdam"
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
	        	    	<svg
	        	    	    class="home-icon-img"
	        	    	    alt="back to homepage"
	        	    	    aria-hidden="true"
	        	    	    xmlns="http://www.w3.org/2000/svg"
	        	    	    viewBox="0 0 24 24">
                    
	        	    	    <path
	        	    	    	d="M11.3 3.3a1 1 0 0 1 1.4 0l6 6 2 2a1 1 0 0 1-1.4 1.4l-.3-.3V19a2 2 0 0 1-2 2h-3a1 1 0 0 1-1-1v-3h-2v3c0 .6-.4 1-1 1H7a2 2 0 0 1-2-2v-6.6l-.3.3a1 1 0 0 1-1.4-1.4l2-2 6-6Z"
	        	    	    	id="my-svg4"
	        	    	    />
	        	    	</svg>
	        	    </a>
                </li>
                {/if} 
            
                {#if !user}
                <li>
	            	<a href="/login" aria-label="account">
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
	            	</a>
                </li>
	            {/if}

                <li>
                    <a aria-label="lightmode button" class="disable-js" href=" ">
	                	<button aria-label="lightmode" class="toggle" onclick={toggleLightMode}>
	                		<svg
	                			id="icon"
	                			alt="darkmode icon"
	                			width="24"
	                			height="24"
	                			viewBox="0 0 24 24"
	                			xmlns="http://www.w3.org/2000/svg"
	                		>
	                			<path
	                				id="my-svg"
	                				d="M12 24C18.6276 24 24 18.6276 24 12C24 5.3724 18.6276 0 12 0C5.3724 0 0 5.3724 0 12C0 18.6276 5.3724 24 12 24ZM12 21.6V2.4C14.5461 2.4 16.9879 3.41143 18.7882 5.21178C20.5886 7.01212 21.6 9.45392 21.6 12C21.6 14.5461 20.5886 16.9879 18.7882 18.7882C16.9879 20.5886 14.5461 21.6 12 21.6Z"
	                			/>
	                		</svg>
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
        padding: 1rem 0 1rem 0;
		overflow-x: clip;

        .header-wrapper {
            display: grid;
            grid-template-columns: 30% 40% 30%;
            grid-template-rows: 100%;
            justify-content: center;
            justify-items: center;
            align-items: center;
            margin: 0 1.25rem 0 1.25rem;

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