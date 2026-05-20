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

	.select, .dropdown, .full, .header { 
		justify-content: space-between;
	}

	.select, .full {
		width: 100%;
	}

	.primary, .header {
		background-color: var(--color-primary);
        color: var(--color-neutral-white);
	}

	/* sizes */
	.small { width: 3em;}
	.medium {width: 8em;}
	.large {width: 12em;}
	.xlarge {width: 16em;}

	@media (max-width: 1080px) {
        .medium { width: 6em; }
        .large { width: 8em; }
    }

	.header {
		border: none;
	}

	.select {
		border: var(--color-neutral-white) 1px solid;

		display: inline-flex;

		&:focus {
			border: var(--color-neutral-white) 2px solid;
		}
	}

	.dropdown {
		width: 15em;
		margin: 0 auto;

		@media (max-width: 720px) {
            width: 100%;
            justify-content: center;
            gap: 1em;
        }
	}

	.pages { 
		align-content: center; 
	}

    .invisible { 
		display: none; 
	}


    .active {
        transition-duration: 0.3s;
        border-bottom: 5px solid var(--color-neutral-white);
        border-radius: 12px 12px 0 0;
    }

	/* for the dropdowns */
	.select {
		width: 100%;
		font-size: 12px;
		height: 2em;
		justify-content: flex-start;
		align-items: center;
		border: var(--color-neutral-white) 1px solid;

		display: inline-flex;

		&:focus {
			transition-duration: 0.2s;
			border: var(--color-neutral-white) 2px solid;
		}
	}

	.dropdown {
		width: 16em;
		font-size: 16px;
		place-items: center;
		margin: 0px auto;
		justify-content: space-between;
		flex-direction: row-reverse;
		height: 2em;
		display: inline-flex;

		@media (max-width: 1320px) {
			width: 12em;
		}

		@media (max-width: 1080px) {
			width: 100%;
			justify-content: center;
			gap: 1em;
		}
	}

	.dropdown-wrap {
		width: 80%;
		font-size: 16px;
		place-items: center;
		margin: 0px auto;
		justify-content: space-between;
		flex-direction: row-reverse;
		height: 2em;
		display: inline-flex;

	}

	.full {
		width: 100%;
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

	.disabled {
		filter: grayscale(100);
		opacity: 0.3;
		height: 2em;
	}

	.hamburger {
		color:var(--color-neutral-white);
	}

</style>


