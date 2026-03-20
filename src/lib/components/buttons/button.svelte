<script>
	let { icon, title, onclick, imgsrc, size } = $props();
</script>

<button onclick={onclick} class={size}>
    <!-- with svelte:component you can import component within a component -->
    <svelte:component this={icon} />
        <img src={imgsrc} />
    <p> {title} </p>
</button>

<style>
    .small {
        width: 3em;
        justify-content: center;

        svg {
            display: flex;
            justify-content: center;
        }
    }

    .medium {
        width: 6em;
    }

    .large {
        width: 12em;
    }

    button {
        display: flex;
        align-items: center;
        padding-left: 1em;
        padding-right: 1em;
        border-radius: 1em;
        height: 3em;
        background-color: var(--color-primary-light);
    }
</style>