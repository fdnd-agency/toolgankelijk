<script>
	let { icon, title, href } = $props();
</script>

<a href={href}>
    <!-- with svelte:component you can import component within a component -->
    <svelte:component this={icon} />
    <p> {title} </p>
</a>

<style>
    a {
        display: flex;
        justify-content: center;
        align-items: center;
        text-decoration: none;
        width: 12em;
        padding-left: 1em;
        padding-right: 1em;
        border-radius: 1em;
        gap: 1em;
        height: 3em;
        background-color: var(--color-primary-light);
        color: var(--color-neutral-dark-grey)
        border: var(--border-darkgrey);
    }
</style>