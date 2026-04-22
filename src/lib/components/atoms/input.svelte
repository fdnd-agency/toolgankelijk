<script>
	import Icon from '$lib/components/atoms/icon.svelte';

	let { iconName, showIcon = false, addFor, placeholderProp = '', size = 'full' } = $props();
</script>

<div class="input-wrapper {size}">
	<label for={addFor} class="icon-label">
		<span class="icon-wrapper">
			<Icon {showIcon} {iconName} />
		</span>
	</label>
	<input id={addFor} placeholder={placeholderProp} class="input {showIcon ? 'has-icon' : ''}" />
</div>

.full {
	width: 100%;
}

label {
	position: absolute;
	margin-top: 0.5em;
	margin-left: 0.5em;

	@media (max-width: 720px) {
			color: var(--color-neutral-white);
	}

	input {
		height: 48px;
		width: 100%;
		background-color: var(--color-neutral-white);
		color: var(--color-neutral-black);
		border: var(--color-neutral-black) 1px solid;
		border-radius: 12px;
		font-size: 16px;
		padding-left: 1em;

		@media (max-width: 720px) {
			height: 48px;
			width: 48px;
			background-color: var(--color-primary);
			font-size: 12px;
		}
	}
</style>
