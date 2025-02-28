<script>
	import { onNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import Header from '$lib/components/header.svelte';

	export let data;

	$: params = $page.params;
	$: websites = data.websitesData.website;

	let partners = data.partnersData;

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<Header {params} {partners} {websites} />

<main id="main">
	<slot />
</main>
