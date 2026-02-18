<script>
    import { onMount } from 'svelte';
	// import logoDarkModeDesktop from '$lib/assets/LogoDarkModeDesktop.svg';
	// import logoLightModeDesktop from '$lib/assets/LogoLightModeDesktop.svg';
    import logoDarkMode from '$lib/assets/LogoDarkModeMobile.png';
	import logoLightMode from '$lib/assets/LogoLightModeMobile.png';
	import BreadCrumbs from '$lib/components/breadCrumbs.svelte';
	import Hamburger from '$lib/components/hamburger.svelte';

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

		const logoImage = document.getElementById('logoImage');
		logoImage.src = isLightMode ? logoLightMode : logoDarkMode;

		const icon = document.querySelector('.disable-js');
		icon?.classList.toggle('disable-js');
	});
</script>
