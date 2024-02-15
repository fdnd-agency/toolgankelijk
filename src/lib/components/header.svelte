<script>
	import logo from '$lib/assets/vervoerregio_amsterdam_logo.svg';
	import informationIcon from '$lib/assets/information_icon.svg';
	import BreadCrumbs from '$lib/components/bread-crumbs.svelte';
	import accountIcon from '$lib/assets/account_icon.svg';
	import darkMode from '$lib/assets/dark_mode_icon.svg';

	export let params;
	export let partners;
	export let websites;

	function toggleLightMode() {
		document.body.classList.toggle('lightmode');
	}

	import { onMount } from 'svelte';

	let jsEnabled = false;

	onMount(() => {
		// JavaScript is enabled, toggle the class
		jsEnabled = true;
		let icon = document.querySelector('.disable-js');

		icon.classList.toggle('disable-js');
	});
</script>

<header>
	<nav>
		<a href="/" aria-label="Ga naar het overzicht met alle partners"
			><img src={logo} alt="Logo van Vervoerregio Amsterdam" /></a
		>
		<BreadCrumbs {params} {partners} {websites} />

		<div class="options">
			<a href="/info">
				<img class="information-icon-img" src={informationIcon} alt="information icon" />
			</a>
			<a href="/login">
				<img class="account-icon-img" src={accountIcon} alt="account icon" />
			</a>
			<a class="disable-js" href=" ">
				<button on:click={toggleLightMode}
					><img id="icon" src={darkMode} alt="darkmode icon" /></button
				>
			</a>
			<span class="lightmode" />
		</div>
	</nav>
</header>

<style>
	.lightmode {
		--c-background: white;
		/* --c-white: black; */
		--c-container: rgb(227, 0, 89);
	}

	button {
		cursor: pointer;
		background: none;
		border: none;
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

	.disable-js {
		display: none;
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

	.account-icon-img {
		width: 2rem;
		height: 1.6rem;
	}
</style>
