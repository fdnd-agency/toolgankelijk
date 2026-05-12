<script>
	import { onNavigate } from '$app/navigation';
	import Header from '$lib/components/templates/header.svelte';
	import SubHeader from '$lib/components/templates/subheader.svelte';

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
<SubHeader 
	{params} 
	{partners} 
	websites={websitesArray}
	{principles} 
	{heading}
	user={data.user}
	overview={data.urlData?.url?.website || data.websitesData?.website}
/>

<main id="main">
	{@render children?.()}
</main>
