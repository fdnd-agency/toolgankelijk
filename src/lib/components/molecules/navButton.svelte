<script>
	import Icon from '$lib/components/atoms/icon.svelte';

	let {
		iconName,
		showIcon = false,
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
	{onclick}
	{...rest}
	aria-label={aria}
>
	<span class="icon-wrapper">
		<Icon showIcon={true} {iconName} />
	</span>

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

	.small {
		width: 3em;
		padding: 1em 1em;
		font-size: 16px;
	}
	.medium {
		width: 8em;
		padding: 1em 1em;
		font-size: 16px;

		@media (max-width: 1080px) {
			width: 6em;
		}
	}
	.large {
		width: 12em;
		padding: 1em 1em;
		font-size: 16px;
		justify-content: space-around;

		@media (max-width: 1080px) {
			width: 8em;
		}
	}
	.xlarge {
		width: 16em;
		padding: 1em 1em;
		font-size: 16px;
		justify-content: space-around;
	}

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



	/* for the dropdowns */
	.select {
		width: 100%;
		justify-content: space-between;
		align-items: center;
		border: var(--color-neutral-white) 1px solid;

		&:focus {
			transition-duration: 0.2s;
			border: var(--color-neutral-white) 2px solid;
		}
	}

	.dropdown {
		width: 15em;
		place-items: center;
		margin: 0px auto;
		justify-content: space-around;

		@media (max-width: 720px) {
			width: 100%;
			justify-content: center;
			gap: 1em;
		}
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

	.header {
		background-color: var(--color-primary);
		color: var(--color-neutral-white);
		border: none;
		border-bottom: 2px solid var(--color-neutral-white);
		border-radius: 0px;
		border-top-left-radius: 12px;
		border-top-right-radius: 12px;
	}

	.active {
		transition-duration: 0.3s;
		background-color: var(--color-neutral-white);
		color: var(--color-primary);
	}
</style>
