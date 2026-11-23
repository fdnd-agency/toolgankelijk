<script>
	// not yet refactored should be in the subheader
	import { onMount } from 'svelte';
	import Icon from '$lib/components/atoms/icon.svelte';

	let { placeholderProp } = $props();

	let input = $state();

	function submitPartner() {
		let websites = document.querySelectorAll('.website');

		websites.forEach((website) => {
			if (!website.innerText.toUpperCase().includes(input.toUpperCase())) {
				website.classList.add('container-off');
			} else {
				website.classList.remove('container-off');
			}
		});
	}

	onMount(() => {
		document.querySelector('form').classList.remove('form-off');
	});
</script>

<form class="form-off" oninput={submitPartner}>
	<input type="search" id="partner-search" placeholder="zoeken" bind:value={input} />
	<button>
		<Icon showIcon={true} iconName="search"/>
	</button>
</form>

<style>
	form {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--gap-medium);
		font-weight: 600;
		grid-area: search;
		border: 2px solid var(--color-neutral-black);
		border-radius: var(--border-radius-m);
		width: clamp(12em, 100%, 20em);
		box-sizing: border-box;
		height: 3em;

		@container (width > 740px){
			justify-content: flex-end;
		}
	}

	.form-off {
		display: none;
	}

	label {
		position: relative;
		align-items: center;
		left: 7em;
		opacity: 0.3;
	}

	input {
		padding: 0.5em;
		border: none;
		color: var(--color-neutral-black);
		font-size: 1em;
		font-weight: 600;
		height: 100%;
		background: transparent;
	}

	input::placeholder {
		color: var(--color-neutral-black);
		opacity: 0.8;
	}

	form:has(input:focus-visible) {
		outline: 2px solid var(--color-primary);
		outline-offset: 2px;
	}

	input:focus-visible {
		outline: none;
	}

	button{
		margin: 0.5em;
	}

	button:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 2px;
		border-radius: inherit;
	}
</style>
