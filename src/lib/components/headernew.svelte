<script>
	import LogoLightMobile from '$lib/components/LogoLightMobile.svelte';
	import HomeIcon from '$lib/components/homeIcon.svelte';
	import DarkmodeIcon from '$lib/components/darkmodeIcon.svelte';
	import SignoutButton from '$lib/components/signoutButton.svelte';
	import InfoIcon from '$lib/components/infoIcon.svelte';
	import Hamburger from '$lib/components/hamburger.svelte';
	import LogoLightDesktop from '$lib/components/LogoLightDesktop.svelte';
	import loginIcon from '$lib/components/loginIcon.svelte';
	import CloseMenu from '$lib/components/CloseMenu.svelte';
	import AccountIcon from './accountIcon.svelte';
	import { onMount } from 'svelte';

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

	/** @type {Props} */
	let { user = null } = $props();
</script>

<header>
    <div class="header-wrapper">
        <a href="#main" class="sr-only">Jump directly to main content</a>

	    <a href="/" class="logo">
			<LogoLightDesktop />
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
					<button aria-label="lightmode" class="toggle" onclick={toggleLightMode}>
						<DarkmodeIcon />
						<p>Dark/Lightmode</p>
					</button>
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
        	grid-template-columns: 1fr auto;
			min-height: 2.5rem;
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
        		position: fixed;
        		top: 0;
        		right: 0;
        		width: 50%;
        		height: 100vh;
        		background: var(--color-neutral-white, white);
        		z-index: 10;
        		padding: 5rem 1rem;
        		box-shadow: -10px 0 30px rgba(0,0,0,0.1);

				ul {
					display: flex;
        			flex-direction: column;
        			gap: 2rem;
        			list-style: none;
        			padding: 0;
        			margin: 0;

					a {
						display: flex;
						height: 1.5rem;
						gap: 1rem;
						text-decoration: none;
					}

					p {
						color: var(--color-neutral-black);
					}

					.toggle {
						display: flex;
						gap: 1rem;
						background: none;
						border: none;
						cursor: pointer;
					}
				}

				@media(min-width: 1260px) {
					display: flex;
					grid-column: 2;
				}
            }

			nav:target {
            	display: flex;
				flex-direction: column;
				align-items: center;

				ul {
					padding: 1.5rem 0 0 0;
				}
			}

			@media(min-width: 1260px) {
				grid-template-columns: 300px 1fr;

				nav {
            		display: flex !important;
            		position: static;
            		width: auto;
            		height: auto;
            		background: transparent;
            		padding: 0;
            		box-shadow: none;
            		justify-content: flex-end;

					ul {
						flex-direction: row;
						justify-content: center;
						align-items: center;
						gap: 1.5rem;
					}
        		}
			}
        }

         &::after {
            content: "";
            margin-top: 1.25rem;
            aspect-ratio: 21.833;
            min-width: 450px;
            width: 100%;
			z-index: 20;
            height: clamp(1.5rem, 5vw, 5rem);
			/* The pink line */
            clip-path: shape(from 28.24% 100%,hline to 0%,vline to 94.74%,hline to 28.24%,curve to 37.66% 0% with 32.44% 94.74%/32.44% 0%,hline to 100%,vline to 5.26%,hline to 37.66%,curve to 28.24% 100% with 32.44% 5.26%/32.44% 100%,close);            
			background-color: var(--color-primary);
        }
	}

	.header-wrapper:has(#main-nav:target) {
    	:global(.hamburger-link) {
			display: none;
		} 
		:global(.close-menu) {
			display: block;
		}
	}
</style>