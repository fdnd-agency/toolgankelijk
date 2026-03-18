<script>
	import { onNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import Header from '$lib/components/header.svelte';

	let { data, children } = $props();

	let params = $derived($page.params);
	let websites = $derived(data.websitesData.website);
	let principles = $derived(data.principlesData.principles);

	let partners = $derived(data.partnersData);

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

<Header {params} {partners} {websites} {principles} user={data.user} />

<main id="main">
	{@render children?.()}
</main>
