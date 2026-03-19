<script>
	let { icon, title, onclick } = $props();
</script>

<button onclick={onclick}>
    <!-- with svelte:component you can import component within a component -->
    <svelte:component this={icon} />
    <p> {title} </p>
</button>

<style>
    button {
        display: flex;
        align-items: center;
        padding-left: 1em;
        padding-right: 1em;
        border-radius: 1em;
        gap: 1em;
        height: 3em;
        background-color: var(--color-primary-light);
    }
</style>