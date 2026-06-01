<script>
	import { page } from '$app/stores';
	import { onNavigate } from '$app/navigation';
	import Header from '$lib/components/templates/header.svelte';
	import SubHeader from '$lib/components/templates/subheader.svelte';
	import Dialog from '$lib/components/templates/dialog.svelte';

	let dialogRef = $state();

	let { data, children } = $props();

	let params = $derived($page.params);

	let websitesArray = $derived(
		data.urlData?.url?.website?.urls || data.websitesData?.website?.urls || []
	);

	let websites = $derived(data.websitesData || []);
	let principles = $derived(data.principlesData?.principles || []);
	let partners = $derived(data.partnersData || []);

	let heading = $derived({
		title: data.urlData?.url?.website?.title ?? data.websitesData?.website?.title ?? '',
		homepage: data.urlData?.url?.url ?? '',
		url: data.urlData?.url?.slug ?? ''
	});

	let showSubHeader = $derived(
		!$page.url.pathname.startsWith('/info') &&
			!$page.url.pathname.startsWith('/account') &&
			!$page.url.pathname.startsWith('/login') &&
			!$page.url.pathname.startsWith('/register') &&
			!$page.url.pathname.startsWith('/logout')
	);

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});



	function openAddUrl() {
		dialogRef?.open();
	}
</script>
<Dialog bind:this={dialogRef} {params} isType="addPartner" />

<Header />

{#if showSubHeader}
	<SubHeader
		{params}
		{partners}
		websites={websitesArray}
		{principles}
		onAdd={openAddUrl}
		{heading}
		user={data.user}
		overview={data.urlData?.url?.website || data.websitesData?.website}
	/>
{/if}

<main id="main">
	{@render children?.()}
</main>
