<script>
	let { icon, title, href, active, size } = $props();
</script>

<a href={href} id={active} class={size} >
    <!-- with svelte:component you can import component within a component -->
    <svelte:component this={icon} />
    {title}
</a>

<style>
    .small {
        width: 3em;
        display: flex;
        justify-content: center;
    }

    .medium {
        width: 6em;
        padding-left: 1em;
        padding-right: 1em;
    }

    .large {
        width: 9em;
        gap: 1em;
        padding-left: 1em;
        padding-right: 1em;
    }
    
    #active {
        background-color: var(--color-neutral-white);
        border: var(--border-darkgrey);
    }

    a {
        display: flex;
        align-items: center;
        text-decoration: none;
        border-radius: 1em;
        gap: 1em;
        height: 3em;
        background-color: var(--color-primary-light);
        color: var(--color-neutral-dark-grey);
        border: var(--border-darkgrey);
    }
</style>