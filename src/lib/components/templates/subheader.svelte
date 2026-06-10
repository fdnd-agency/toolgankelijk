<script>
	// subheader in beneath the header
	import { page } from '$app/stores';
	import NavButton from '$lib/components/molecules/navButton.svelte';
	import BreadCrumbs from '$lib/components/organisms/breadCrumbs.svelte';
	import Heading from '$lib/components/molecules/heading.svelte';
	import Search from '$lib/components/molecules/search.svelte';

	let {
		params,
		user,
		partners = [],
		websites = [],
		principles = [],
		overview,
		showAdd = false,
		onAdd,
		heading
	} = $props();

	let principle = $state('All');
	let level = $state('All');
	let showNotMet = $state(false);
	let showMet = $state(false);

	function handleSubmit(e) {
		if (e) e.preventDefault();

		if (onApply) {
			onApply({
				principle,
				level,
				showNotMet,
				showMet
			});
		}
	}
</script>

<div class="subheader">
	<div class="subheader-heading">
		<Heading {heading} />
		{#if user && user.isEmailVerified}
			<BreadCrumbs {params} {partners} {websites} {overview} {principles} width="full" />
		{/if}
	</div>

	<div class="subheader-form">
		<!-- this will be placed on a sidebar of the principles page -->
		<div class="subheader-form-up-wrapper">
		<!-- only button working to add a new partner/url -->
			<NavButton
				size="small"
				variant="primary"
				showIcon={true}
				iconName="add"
				onclick={onAdd}
			></NavButton>
			<Search effect="disabled" />
		</div>

		<div class="subheader-form-down-wrapper">
			<p>Sorteren op</p>
			<NavButton effect="disabled">Levels</NavButton>

			<NavButton effect="disabled">Principles</NavButton>
		</div>

		<div class="subheader-dropdown-wrapper">
			<NavButton
				size="small"
				showIcon={true}
				iconName="arrow"
				effect="disabled"
				aria="dropdown menu"
			></NavButton>
		</div>
	</div>
</div>

<style>
	.subheader {
		height: 10em;
		padding-left: 5%;
		padding-right: 5%;
		align-items: center;
		display: flex;
		justify-content: space-between;
		width: 100vw;

		@media (max-width: 1080px) {
			margin-top: 1em;
			margin-bottom: 1em;
		}

		@media (max-width: 720px) {
			display: flex;
			gap: 0.5em;
			padding-right: 5em;
		}
	}

	.subheader-heading {
		display: flex;
		margin-left: 2%;
		flex-direction: column;
		gap: 0.5em;
		width: 100%;
	}

	.subheader-form {
		display: flex;
		gap: 0.5em;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.subheader-form-up-wrapper {
		display: flex;
		justify-content: flex-end;
		align-items: center;

		@media (max-width: 1080px) {
			padding-left: 4em;
		}

		@media (max-width: 1080px) {
			display: none;
		}
	}

	.subheader-form-down-wrapper {
		display: flex;
		gap: 1em;
		align-items: center;
		justify-content: flex-start;

		@media (max-width: 1080px) {
			display: none;
		}
	}

	.subheader-dropdown-wrapper {
		padding-bottom: 1em;
		margin-left: 1em;

		@media (min-width: 1080px) {
			display: none;
		}
	}
</style>
