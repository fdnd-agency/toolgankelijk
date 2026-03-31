<script>
    import AccountIcon from '$lib/components/icons/accountIcon.svelte';
    import AddIcon from '$lib/components/icons/addIcon.svelte';
    import AlertIcon from '$lib/components/icons/alertIcon.svelte';
    import AlphabeticalIcon from '$lib/components/icons/alphabeticalIcon.svelte';
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
        type,
        variant = "primary",
        size = "medium",
        href,
        as,
        children,
        onclick,
        aria,
        ...rest
    } = $props();

    const tagname = $derived(as || (href ? "a" : "button"));

    const iconMap = {
        account: AccountIcon,
        add: AddIcon,
        alert: AlertIcon,
        alphabetical: AlphabeticalIcon,
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
    class="navbutton {size} {variant}"
    {onclick}
    {...rest}
    araia-lable={aria}
>
    {#if showIcon && ActiveIcon}
        <span class="icon-wrapper">
            <ActiveIcon />
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

    .small { width: 3em;
            padding: 1em 1em;
        font-size: 16px; }
    .medium { width: 8em;
            padding: 1em 1em;
         font-size: 16px;}
    .large { width: 12em;
            padding: 1em 1em;
         font-size: 16px;
        justify-content: space-between; }
    .xlarge { width: 16em;
            padding: 1em 1em;
         font-size: 16px; 
                justify-content: space-between;}

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
</style>