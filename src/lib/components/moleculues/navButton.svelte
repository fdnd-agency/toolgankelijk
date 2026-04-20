<script>
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

	let {
		iconName,
		showIcon = false,
		type,
		variant = 'primary',
		size = 'medium',
		href,
		as,
		children,
		onclick,
		aria,
		effect = null,
		active = null,
		...rest
	} = $props();

	const tagname = $derived(as || (href ? 'a' : 'button'));

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

<svelte:element
	this={tagname}
	{href}
	{type}
	class="navbutton {size} {variant} {active} {effect}"
	{onclick}
	{...rest}
	aria-label={aria}
>
	{#if showIcon && ActiveIcon}
		<span class="icon-wrapper">
			<svelte:component this={ActiveIcon} />
		</span>
	{/if}
	{@render children?.()}
</svelte:element>

<style>
	.navbutton {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--border-radius);
		transition: all 0.2s ease;
		cursor: pointer;
		text-decoration: none;
		border: var(--border-white, 1px solid transparent);
		height: 3em;
		gap: 0.5em;
	}

	.navbutton:hover {
		filter: brightness(1.1);
	}

	.navbutton:focus {
		border: white 3px solid;
	}

	.icon-wrapper {
		display: inline-flex;
		align-items: center;
	}

	.small {
		width: 3em;
		padding: 1em 1em;
		font-size: 16px;
	}
	.medium {
		width: 8em;
		padding: 1em 1em;
		font-size: 16px;

		@media (max-width: 1080px) {
			width: 6em;
		}
	}
	.large {
		width: 12em;
		padding: 1em 1em;
		font-size: 16px;
		justify-content: space-around;

		@media (max-width: 1080px) {
			width: 8em;
		}
	}
	.xlarge {
		width: 16em;
		padding: 1em 1em;
		font-size: 16px;
		justify-content: space-around;
	}

	.primary {
		background-color: var(--color-primary);
		color: var(--color-neutral-white);
		border: var(--color-neutral-lightgrey) 2px solid;
	}

	.secondary {
		background-color: var(--color-primary-light);
		color: var(--color-neutral-black);
		border: var(--color-neutral-darkgrey) 2px solid;
	}

	.active {
		background-color: var(--color-neutral-white);
		color: var(--color-primary);
	}

	/* for the dropdowns */
	.select {
		width: 100%;
		justify-content: space-between;
		align-items: center;
		border: var(--color-neutral-white) 1px solid;

		&:focus {
			transition-duration: 0.2s;
			border: var(--color-neutral-white) 2px solid;
		}
	}

	.dropdown {
		width: 15em;
		place-items: center;
		margin: 0px auto;
		justify-content: space-around;

		@media (max-width: 720px) {
			width: 100%;
			justify-content: center;
			gap: 1em;
		}
	}

	.full {
		width: 100%;
	}
</style>
