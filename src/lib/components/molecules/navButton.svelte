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
        effect = '',
        active = '',
        ...rest
    } = $props();

    const tagname = $derived(as || (href ? 'a' : 'button'));
</script>

<!-- in this element which is replaced buttons and a tags in the project already fully processed -->
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
    <!-- Conditionally render the icon wrapper so it doesn't take space if missing -->
    {#if showIcon}
        <span class="icon-wrapper">
            <Icon {showIcon} {iconName} />
        </span>
    {/if}

    <!-- Conditionally render children to fix empty text spanning breaking flex alignment -->
    {#if children}
        <span class="text">
            {@render children()}
        </span>
    {/if}
</svelte:element>

<style>
    .navbutton {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: var(--border-radius, 8px);
        transition: all 0.2s ease;
        cursor: pointer;
        text-decoration: none;
        border: var(--border-white, 1px solid transparent);
        gap: 0.5em;
        font-size: 1em;
        padding: 0 1em; /* Provide default padding for text buttons */
        box-sizing: border-box;
    }

    .navbutton:hover {
        filter: brightness(1.1);
    }

    .navbutton:focus {
        border: white 1px solid;
    }

    .icon-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        line-height: 1; /* Prevents awkward SVG shifting */
    }

    .primary {
        background-color: var(--color-primary);
        color: var(--color-neutral-white);
    }

    .active {
        transition-duration: 0.3s;
        border-bottom: 5px solid var(--color-neutral-white);
        border-radius: 12px 12px 0 0;
    }

    .disabled {
        filter: grayscale(100%);
        font-size: 0.95em;
        height: 2.8em;
        background-color: var(--color-primary-light, #f8d7e8);
        color: var(--color-neutral-black);
        margin: 0;
        display: inline-flex;
        align-items: center;
        justify-content: space-between;
        flex-direction: row-reverse; 
        padding: 0 1em;
        opacity: 0.3;
        pointer-events: none;
        cursor: not-allowed;
    }

    .small {
        width: 3em;
        height: 3em;
        padding: 0;
        justify-content: center;
    }

    .medium {
        width: 8em;
        height: 3em;
    }

    .large {
        width: 12em;
    }

    .xlarge {
        width: 16em;
    }

    .full {
        width: 100%;
        justify-content: space-between;
    }

    @media (max-width: 1080px) {
        .medium {
            width: 6em;
        }
        .large {
            width: 8em;
        }
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
        width: 12em;
        font-size: 0.95em;
        height: 2.8em;
        background-color: var(--color-primary-light, #f8d7e8);
        color: var(--color-neutral-black);
        margin: 0;
        display: inline-flex;
        align-items: center;
        justify-content: space-between;
        flex-direction: row-reverse; 
        padding: 0 1em;
    }

    @media (max-width: 1320px) {
        .dropdown {
            width: 10em;
        }
    }

    @media (max-width: 1080px) {
        .dropdown {
            width: 100%;
            justify-content: space-between;
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

    .cross {
        justify-content: center;
        padding: 0;
    }

	.hamburger {
		color: var(--color-neutral-white);
	}

    .header {
        background-color: var(--color-primary);
        color: var(--color-neutral-white);
        justify-content: center;
        gap: 1em;
        width: 8em;
        border: none;
    }

    .active {
        border: var(--color-neutral-white) 2px solid;
        border-top-width: 0px;
        border-left-width: 0px;
        border-right-width: 0px;
    }

    .invisible {
        display: none;
    }
</style>