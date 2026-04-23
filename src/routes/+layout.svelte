<script>
	import { onNavigate } from '$app/navigation';
	import Header from '$lib/components/header.svelte';

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

<Header />

<main id="main">
	{@render children?.()}
</main>
