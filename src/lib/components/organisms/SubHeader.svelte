<script>
	import { page } from '$app/stores';
	import AddButton from '$lib/components/atoms/AddButton.svelte';
	import BreadCrumbs from '$lib/components/molecules/FilterBreadCrumbs.svelte';
	import FilterForm from '$lib/components/molecules/FilterForm.svelte';
	import Heading from '$lib/components/atoms/Heading.svelte';
	import Search from '$lib/components/atoms/Search.svelte';

	let {
		params,
		user,
		partners = [],
		websites = [],
		principles = [],
		heading,
		filters = []
	} = $props();

	// inside a partner you add a url, otherwise you add a partner
	let addHref = $derived(params?.websiteUID ? `/${params.websiteUID}?add` : '/?add');
	let addLabel = $derived(params?.websiteUID ? 'Url toevoegen' : 'Partner toevoegen');

	// routes where the search bar and add partner button are shown
	const topSubHeader = ['/', '/[websiteUID]'];
	let showTopSubHeader = $derived(topSubHeader.includes($page.route.id));
</script>

<div class="subheader-container">
	<section class="subheader-layout">
		<Heading {heading}/>

		{#if showTopSubHeader}
			<AddButton href={addHref} label={addLabel}/>

			<Search/>
		{/if}

		{#if user && user.isEmailVerified}
			<BreadCrumbs {params} {partners} {websites} {principles} />
		{/if}

		<FilterForm {filters} />
	</section>
</div>

<style>
	.subheader-container{
		container-type: inline-size;
		container-name: subheader;
	}

	.subheader-layout{
		margin-inline: var(--margin-page-inline);
		margin-block: 2% 5%;
		display: grid;
		grid-template-areas: 
		'heading'
		'addbtn'
		'breadcr'
		'filter'
		'search';
		gap: var(--gap-small);
		align-items: center;
	}

	@container subheader (width > 740px) {
		.subheader-layout {
			grid-template-columns: 1fr auto auto;
			grid-template-areas:
				'heading addbtn  search'
				'breadcr filter  filter';
		}
	}

</style>