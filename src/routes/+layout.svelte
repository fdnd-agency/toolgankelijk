<script>
	import { onNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import Header from '$lib/components/templates/header.svelte';
	import NavButton from '$lib/components/moleculues/navButton.svelte';

	let { children } = $props();


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

