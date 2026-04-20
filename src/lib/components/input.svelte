<script>
	import AccountIcon from '$lib/components/icons/accountIcon.svelte';
	import AddIcon from '$lib/components/icons/addIcon.svelte';
	import AlertIcon from '$lib/components/icons/alertIcon.svelte';
	import AlphabeticalIcon from '$lib/components/icons/alphabeticalIcon.svelte';
	import ArrowIcon from '$lib/components/icons/arrowIcon.svelte';
	import AuditIcon from '$lib/components/icons/auditIcon.svelte';
	import BulbIcon from '$lib/components/icons/bulbIcon.svelte';
	import CheckIcon from '$lib/components/icons/checkIcon.svelte';
	import CrossIcon from '$lib/components/icons/crossIcon.svelte';
	import DeleteIcon from '$lib/components/icons/deleteIcon.svelte';
	import EditIcon from '$lib/components/icons/editIcon.svelte';
	import FilterIcon from '$lib/components/icons/filterIcon.svelte';
	import HomeIcon from '$lib/components/icons/homeIcon.svelte';
	import InfoIcon from '$lib/components/icons/infoIcon.svelte';
	import MenuIcon from '$lib/components/icons/menuIcon.svelte';
	import MoonIcon from '$lib/components/icons/moonIcon.svelte';
	import SearchIcon from '$lib/components/icons/searchIcon.svelte';
	import SunIcon from '$lib/components/icons/sunIcon.svelte';

	let {
		iconName,
		showIcon = false,
		addFor,
		placeholderProp,
		size
	} = $props();

	const iconMap = {
		account: AccountIcon,
		add: AddIcon,
		alert: AlertIcon,
		alphabetical: AlphabeticalIcon,
		arrow: ArrowIcon,
		audit: AuditIcon,
		bulb: BulbIcon,
		check: CheckIcon,
		cross: CrossIcon,
		delete: DeleteIcon,
		edit: EditIcon,
		filter: FilterIcon,
		home: HomeIcon,
		info: InfoIcon,
		menu: MenuIcon,
		moon: MoonIcon,
		search: SearchIcon,
		sun: SunIcon
	};

	const ActiveIcon = $derived(iconName ? iconMap[iconName] : null);
</script>

	<label for={addFor}>
		{#if showIcon && ActiveIcon}
		<span class="icon-wrapper">
			<svelte:component this={ActiveIcon} />
		</span>
	{/if}
	</label>
	<input
		{iconName}
		placeholder={placeholderProp}
		class="input {size}"
	/>
<style>

.full {
	width: 100%;
}

label {
	position: absolute;
	margin-top: 0.5em;
	margin-left: 0.5em;

	@media (max-width: 720px) {
			color: var(--color-neutral-white);
	}
}

input {
	height: 48px;
	width: 100%;
	background-color: var(--color-neutral-white);
	color: var(--color-neutral-black);
	border: var(--color-neutral-black) 1px solid;
	border-radius: 12px;
	font-size: 16px;
	padding-left: 1em;

	@media (max-width: 720px) {
			height: 48px;
			width: 48px;
			background-color: var(--color-primary);
			font-size: 12px;
	}
}
</style>
