<script>
	import { page } from '$app/stores';
	import AddButton from '$lib/components/atoms/AddButton.svelte';
	import BreadCrumbs from '$lib/components/molecules/FilterBC.svelte';
	import FilterForm from '$lib/components/organisms/filterForm.svelte';
	import Heading from '$lib/components/molecules/heading.svelte';
	import Search from '$lib/components/atoms/Search.svelte';

	let {
		params,
		user,
		partners = [],
		websites = [],
		principles = [],
		overview,
		showAdd = false,
		heading,
		filters = []
	} = $props();

	// inside a partner you add a url, otherwise you add a partner
	let addHref = $derived(params?.websiteUID ? `/${params.websiteUID}?add` : '/?add');
	let addLabel = $derived(params?.websiteUID ? 'Url toevoegen' : 'Partner toevoegen');
</script>

<section class="subheader-layout">
	<Heading {heading}/>

	<AddButton href={addHref} label={addLabel}/>

	<Search/>

	{#if user && user.isEmailVerified}
		<BreadCrumbs {params} {partners} {websites} {principles} />
	{/if}

	<FilterForm {filters} />
</section>

<style>
.subheader-layout{
	margin: var(--margin-inline);
	display: grid;
	grid-template-areas: 
	'heading add'
	'breadcr breadcr'
	'filter  filter'
	'search  search';
}
</style>