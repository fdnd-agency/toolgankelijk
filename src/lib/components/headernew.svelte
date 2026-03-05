<script>
    // import { onMount } from 'svelte';
	import LogoLightMobile from '$lib/components/LogoLightMobile.svelte';
	import BreadCrumbs from '$lib/components/breadCrumbs.svelte';
	import Hamburger from '$lib/components/hamburger.svelte';
	import LogoLightDesktop from '$lib/components/LogoLightDesktop.svelte';
	import loginIcon from '$lib/components/loginIcon.svelte';
	import SignoutButton from '$lib/components/SignoutButton.svelte';

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
</script>

<header>
    <div class="header-wrapper">
        <a href="#main" class="sr-only">Jump directly to main content</a>

	    <a href="/" class="logo">
			<LogoLightDesktop />
			<LogoLightMobile />
        </a>

        <nav>
            <ul>
				{#if user && user.isEmailGeverifieerd}
					<li>
	    				<BreadCrumbs {params} {partners} {websites} {principes} />
					</li>
	    		{/if}
            
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
    </div>
</header>

<style>
    header {
        display: flex;
        flex-direction: column;
        position: relative;
        padding: 1rem 0;
		overflow-x: clip;

        .header-wrapper {
            display: grid;
            grid-template-columns: 3fr 4fr 3fr;
            grid-template-rows: 1fr;
            justify-items: right;
            align-items: center;
            margin: 0 1.25rem;

            .logo {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: start;
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
				grid-column: 2;

				ul {
					display: flex;
					gap: 1.5rem;
					justify-content: center;
					align-items: center;
					list-style-type: none;
				}

				@media(min-width: 1260px) {
					display: flex;
				}
            }

			@media(min-width: 1260px) {
				grid-template-columns: 3fr 7fr;
			}
        }

         &::after {
            content: "";
            margin-top: 1.25rem;
            aspect-ratio: 21.833;
            min-width: 450px;
            width: 100%;
            height: clamp(1.5rem, 5vw, 5rem);
			/* The pink line */
            clip-path: shape(from 28.24% 100%,hline to 0%,vline to 94.74%,hline to 28.24%,curve to 37.66% 0% with 32.44% 94.74%/32.44% 0%,hline to 100%,vline to 5.26%,hline to 37.66%,curve to 28.24% 100% with 32.44% 5.26%/32.44% 100%,close);            background-color: #E30059;
        }
	}
</style>