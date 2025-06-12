<script>
	import { onMount } from 'svelte';

	export let placeholderProp;

	let input;

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

<form class="form-off" on:input={submitPartner}>
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
		color: var(--c-white2);
	}

	input {
		padding: 0.5em;
		border: 1px solid var(--c-modal-button);
		background-color: var(--c-container);
		border-radius: 0.25em;
		color: var(--c-white);
		width: 8.5em;
		font-size: 1em;
		font-weight: 600;
		padding-left: 0.75em;
	}

	input::placeholder {
		color: var(--c-grey);
		opacity: 0.8;
	}
</style>
