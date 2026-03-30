<script>
    let {
        type,
        variant = "primary",
        size = "medium",
        href,
        as,
        children,
        onclick,
        ...rest
        } = $props();

        const tagname = $derived(as || (href ? "a" : "button"))
</script>

<svelte:element
    this={tagname}
    {href}
    {type}
    class="navbutton {variant} {size}"
    {...rest}>
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
    border: var(--border);
}

/* sizes */
.small {
    padding: 1em 2em;
    font-size: 16px;
}

/* medium */
.medium {
    padding: 1em 4em;
    font-size: 16px;
}

.large {
    padding: 1em 8em;
    font-size: 16px;
}

.primary {
    background-color: var(--color-primary);
    border: var(--color-primary-light) solid 1px;
}

.secondary {
    background-color: var(--color-primary-light);
    border: var(--color-primary) solid 1px;
}

    
</style>