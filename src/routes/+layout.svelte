<script>
	import { onNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import Header from '$lib/components/header.svelte';
	import SubHeader from '$lib/components/subheader.svelte';

	let { data, children } = $props();
	let params = $derived($page.params);
	let websites = $derived(data.websitesData);
	let principles = $derived(data.partnersData.principles);

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

<Header/>
<SubHeader  {params} {partners} {websites} {principles} user={data.user} />

<main id="main">
	{@render children?.()}
</main>
