<script>
	// native select with a label, used for the breadcrumbs and the filters
	// no wrapper element: the parent (li or form) decides the layout
	let { id, name, label, options = [], value = '', hideLabel = false } = $props();
</script>

<label for={id} class:visually-hidden={hideLabel}>{label}</label>
<select {id} {name}>
	<!-- customizable select (Chromium): shows the chosen option in an element we can style, ignored by other browsers -->
	<button><selectedcontent></selectedcontent></button>
	{#each options as option}
		<option value={option.value} selected={option.value === value}>{option.label}</option>
	{/each}
</select>

<style>
	label {
		font-weight: bold;
		white-space: nowrap;
	}

	/* hidden on screen but still read by screen readers */
	.visually-hidden {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}

	select {
		appearance: none;
		box-sizing: border-box;
		width: 100%;
		height: 2.2em;
		padding: 0 2em 0 0.6em;
		border: none;
		border-radius: 4px;
		background-color: var(--color-primary-light);
		/* fallback arrow for browsers without customizable select */
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 6'%3E%3Cpath d='M0 0h10L5 6z' fill='%23b9005f'/%3E%3C/svg%3E");
		background-repeat: no-repeat;
		background-position: right 0.6em center;
		background-size: 0.9em;
		color: var(--color-neutral-black);
		font-size: 1em;
		font-weight: bold;
		/* cut off long names with three dots */
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		cursor: pointer;
		max-width: 20rem;
	}

	select:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 2px;
	}

	/* customizable select (Chromium): style the real picker icon and dropdown */
	@supports (appearance: base-select) {
		select,
		select::picker(select) {
			appearance: base-select;
		}

		select {
			display: flex;
			align-items: center;
			gap: .5em;
			padding: 0 .6em;
			background-image: none;
			/* round again only after the options are gone */
			transition: border-radius 0s 0.2s;
		}

		/* the button holds the chosen option, it takes the space next to the picker icon */
		select > button {
			display: flex;
			flex: 1;
			min-width: 0;
			padding: 0;
			border: none;
			background: none;
			color: inherit;
			font: inherit;
		}

		/* cut off long names with three dots at the start, so the end of the name stays visible */
		selectedcontent {
			min-width: 0;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			/* rtl puts the dots on the left, text-align keeps short names on the left */
			direction: rtl;
			text-align: left;
		}

		select::picker-icon {
			content: '';
			flex-shrink: 0;
			width: 0.7em;
			height: 0.45em;
			margin-left: auto;
			background-color: var(--color-primary);
			clip-path: polygon(0 0, 100% 0, 50% 100%);
			transition: rotate 0.2s ease;
		}

		/* open: flat bottom so the select flows into the options */
		select:open {
			border-radius: 4px 4px 0 0;
		}

		select:open::picker-icon {
			rotate: 180deg;
		}

		/* the options get the width of their content, at least as wide as the select */
		select::picker(select) {
			width: max-content;
			min-width: anchor-size(width);
			max-width: 20rem;
			margin: 0;
			border: none;
			/* flat top left so it flows out of the select, round top right when it's wider */
			border-radius: 0 4px 4px 4px;
			background-color: var(--color-primary-light);
			color: var(--color-neutral-black);
			/* closed state of the options, also where they animate back to */
			opacity: 0;
			transition: opacity 0.2s ease;
			box-shadow: 1px 3px 5px rgba(0, 0, 0, 0.234);
		}

		select:open::picker(select) {
			opacity: 1;
		}

		@media (prefers-reduced-motion: reduce) {
			select,
			select::picker(select),
			select::picker-icon {
				transition: none;
			}
		}

		/* long names wrap in the list, so the full name stays readable */
		option {
			padding: 0.4em 0.6em;
			white-space: normal;

			/* urls have no spaces, so allow breaking anywhere */
			overflow-wrap: anywhere;
			

			/* Option to discuss. Shows the end of the name of a title. */
			/* direction: rtl;
			text-align: left;

			&:first-of-type{
				direction: ltr;
			} */
		}

		option::checkmark {
			display: none;
		}

		option:checked,
		option:hover,
		option:focus-visible {
			background-color: var(--color-primary);
			color: var(--color-neutral-white);
		}
	}
</style>
