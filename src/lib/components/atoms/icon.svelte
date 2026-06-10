<script>
	let { iconName, showIcon = false } = $props();

	// all the icons will be imported
	import AccountIcon from '$lib/components/atoms/icons/accountIcon.svelte';
	import AddIcon from '$lib/components/atoms/icons/addIcon.svelte';
	import AlertIcon from '$lib/components/atoms/icons/alertIcon.svelte';
	import AlphabeticalIcon from '$lib/components/atoms/icons/alphabeticalIcon.svelte';
	import ArrowIcon from '$lib/components/atoms/icons/arrowIcon.svelte';
	import AuditIcon from '$lib/components/atoms/icons/auditIcon.svelte';
	import BulbIcon from '$lib/components/atoms/icons/bulbIcon.svelte';
	import CheckIcon from '$lib/components/atoms/icons/checkIcon.svelte';
	import CrossIcon from '$lib/components/atoms/icons/crossIcon.svelte';
	import DeleteIcon from '$lib/components/atoms/icons/deleteIcon.svelte';
	import EditIcon from '$lib/components/atoms/icons/editIcon.svelte';
	import FilterIcon from '$lib/components/atoms/icons/filterIcon.svelte';
	import HomeIcon from '$lib/components/atoms/icons/homeIcon.svelte';
	import InfoIcon from '$lib/components/atoms/icons/infoIcon.svelte';
	import MenuIcon from '$lib/components/atoms/icons/menuIcon.svelte';
	import MoonIcon from '$lib/components/atoms/icons/moonIcon.svelte';
	import SearchIcon from '$lib/components/atoms/icons/searchIcon.svelte';
	import SunIcon from '$lib/components/atoms/icons/sunIcon.svelte';

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

<!-- it shows the icon -->
{#if showIcon && ActiveIcon}
	<ActiveIcon />
{/if}
