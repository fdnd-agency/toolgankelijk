<script>
	import { onMount } from 'svelte';

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
	<label for="partner-search">Zoeken</label>
	<input type="search" id="partner-search" placeholder={placeholderProp} bind:value={input} />
</form>

<style>
	form {
		margin: 0 1em;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		gap: 1em;
		font-weight: 600;
	}

	.form-off {
		display: none;
	}

	label {
		display: none;
	}

	input {
		padding: 0.5em;
		border: 2px solid var(--color-neutral-black);
		background-color: var(--color-neutral-white);
		border-radius: var(--border-radius);
		color: var(--color-neutral-black);
		width: 15em;
		font-size: 1em;
		font-weight: 600;
		padding-left: 0.75em;
	}

	input::placeholder {
		color: var(--color-primary);
		opacity: 0.8;
	}
</style>
