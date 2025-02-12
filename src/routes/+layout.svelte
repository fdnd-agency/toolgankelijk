<script>
	import Header from '$lib/components/header.svelte';
	import { onNavigate } from '$app/navigation';
	import { page } from '$app/stores';

	export let data;
	$: params = $page.params;
	let partners = data.partnersData;
	$: websites = data.websitesData.website;

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
