<script>
	import Icon from '$lib/components/atoms/icon.svelte';

	let {
		iconName,
		showIcon = false,
		target = null,
		action = null,
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
</script>

<svelte:element
	this={tagname}
	{href}
	{type}
	class="navbutton {size} {variant} {active} {effect}"
	popovertarget={target}
	popovertargetaction={action}
	{onclick}
	{...rest}
	aria-label={aria}
>
	<span class="icon-wrapper">
		<Icon showIcon={true} {iconName} />
	</span>

	<span class="text">
		{@render children?.()}
	</span>
</svelte:element>
<style>
    /* ================= BASE BUTTON ================= */
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
        padding: 1em;
        font-size: 1em;
    }

    .navbutton:hover {
        filter: brightness(1.1);
    }

    .navbutton:focus {
        border: white 1px solid;
    }

    .icon-wrapper {
        display: inline-flex;
        align-items: center;
    }

    /* ================= VARIANTS & STATES ================= */
    .primary {
        background-color: var(--color-primary);
        color: var(--color-neutral-white);
    }

    .header {
        background-color: var(--color-primary);
        color: var(--color-neutral-white);
        justify-content: space-between;
        border: none;
    }

    .active {
        transition-duration: 0.3s;
        border-bottom: 5px solid var(--color-neutral-white);
        border-radius: 12px 12px 0 0;
    }

    .disabled {
        filter: grayscale(100%);
        opacity: 0.3;
        height: 2em;
        pointer-events: none;
        cursor: not-allowed;
    }

    .small { width: 3em; }
    .medium { width: 8em; }
    .large { width: 12em; }
    .xlarge { width: 16em; }
    .full { 
        width: 100%; 
        justify-content: space-between;
    }

    @media (max-width: 1080px) {
        .medium { width: 6em; }
        .large { width: 8em; }
    }

    .select {
        width: 100%;
        font-size: 12px;
        height: 2em;
        display: inline-flex;
        align-items: center;
        justify-content: flex-start;
        border: var(--color-neutral-white) 1px solid;
    }

    .select:focus {
        transition-duration: 0.2s;
        border: var(--color-neutral-white) 2px solid;
    }

    .dropdown {
        width: 16em;
        font-size: 16px;
        height: 2em;
        margin: 0 auto;
        display: inline-flex;
        align-items: center;
        justify-content: space-between;
        flex-direction: row-reverse;
    }

    @media (max-width: 1320px) {
        .dropdown { width: 12em; }
    }

    @media (max-width: 1080px) {
        .dropdown {
            width: 100%;
            justify-content: center;
            gap: 1em;
        }
    }

    .dropdown-wrap {
        width: 80%;
        font-size: 16px;
        height: 2em;
        margin: 0 auto;
        display: inline-flex;
        align-items: center;
        justify-content: space-between;
        flex-direction: row-reverse;
    }

    .pages { 
        align-content: center; 
    }

    .invisible { 
        display: none; 
    }

    .cross {
        height: 2em;
        width: 2em;
    }

    .hamburger { 
        justify-content: center;
        color: var(--color-neutral-white);
    }
</style>