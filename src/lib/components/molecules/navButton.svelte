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
		gap: 0.3em;
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

	.text {
		flex: 1;
		min-width: 0;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		text-align: left;
	}

	.small {
		width: 3em;
		padding: 1em 1em;
		font-size: 16px;
		gap: 0;
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

	.active {
		background-color: var(--color-neutral-white);
		color: var(--color-primary);
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
</style>
