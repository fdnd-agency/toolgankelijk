<script>
    let {
        type,
        variant = "primary",
        size = "medium",
        href,
        as,
        childeren,
        ...resizeTo
        } = $props();

        const tagname = $derived(as || (href ? "a" : "button"))
</script>

<svelte:element
    this={tagname}
    {href}
    {type}
    class="btn {variant} {size}"
    {...rest}>
    {@render childeren?.()}
</svelte:element>

<style>

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

    
</style>