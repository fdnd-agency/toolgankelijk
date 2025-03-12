<script>
	import { onMount } from "svelte";
	import Close from '$lib/assets/close.svg';
	// ==============================
	// Data variables
	// ==============================
	export let params;
	export let isUrl;
	// ==============================
	// Variables
	// ==============================
	let title;
	let action;
	let urlTitle;
	let dialog;
	let tip;
	let invalid = "leeg";
	// ==============================
	// Functions
	// ==============================
	if (isUrl) {
		title = "Url toevoegen";
		action = "?/addUrl";
		urlTitle = "Url titel";
		tip = "url";
	}else {
		title = "Partner toevoegen";
		action = "?/addPartner";
		urlTitle = "Partner titel";
		tip = "website";
	}

	export function open() {
        dialog.showModal();
    }

    function close(event) {
        event.preventDefault();
        dialog.close();
    }

	function closeTip() {
		const tipMessage = document.querySelector(".tip-message");
		tipMessage.remove();
	}

	onMount(() => {
	const inputName = document.querySelector("#name");
	const inputUrl = document.querySelector("#url");
	const invalidMessages = document.querySelectorAll(".invalid-message");

	console.log(invalidMessages);

	inputName.addEventListener("input", () => {
		console.log("typing in name input");
		const checkVal = inputName.checkValidity();
			if (!checkVal) {
				invalidMessages[0].innerHTML = "Geen geldige titel";
			}
	});

	inputUrl.addEventListener("input", () => {
		console.log("typing in url input");
		const checkVal = inputUrl.checkValidity();
			if (!checkVal) {
				invalidMessages[1].classList.add
				invalidMessages[1].innerHTML = "Geen geldige url";
			}else {
				invalidMessages[1].innerHTML = "Geldige url";
			}
	});
});
</script>

<dialog bind:this={dialog}>
	<section class="form-container">
		<h2>{title}</h2>

		<div class="tip-message" aria-label="tip message">
			<p>Voeg een bestaande {tip} toe.</p>
			<button on:click={closeTip}><img src="/icons/close.svg" width="24" height="24" alt="sluit"></button>
		</div>

		<form method="POST" action="{action}">
			<label for="name">{urlTitle} <span class="invalid-message">{invalid}</span></label>
			<input id="name" name="name" type="text" placeholder="type een titel..." />

			<label for="url" class="url-label">Url <span class="invalid-message">{invalid}</span></label>
			<input id="url" name="url" type="url" placeholder="type een url link..."/>

			{#if isUrl}
			<label for="slug" class="slug-label">Slug <span>niet aanpasbaar</span></label>
			<input id="slug" name="slug" type="name" value={params} readonly/>
			{/if}

			<div class="button-div" aria-label="button container">
				<button type="submit" class="add-button">Toevoegen</button>
				<button class="remove-button" on:click={close}>Sluiten</button>
			</div>
		</form>
	</section>
</dialog>

<style>
	dialog {
		background-color: var(--c-container);
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		overflow: visible;
		width: 100%;
		max-width: 30rem;
		border: none;
		display: none;
	}

	dialog[open] {
		display: block;
	}

	dialog::backdrop {
		background-color: rgba(44, 44, 44, 0.75);
		backdrop-filter: blur(0.5rem);
	}

	.form-container {
		background-color: var(--c-container);
		border: solid 0.1rem var(--c-container-stroke);
		border-radius: 0.5rem;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
		gap: 1rem;
		padding: 1.2rem;
		width: 100%;
	}

	h2 {
		border-bottom: 0.1rem solid var(--c-container-stroke);
		width: 100%;
		padding-bottom: 0.5rem;
		color: var(--c-white);
	}

	.tip-message {
		background-color: var(--c-container-stroke);
		display: flex;
		flex-direction: row;
		align-items: center;
		border-radius: 0.25rem;
		overflow: hidden;
		width: 100%;
		padding: 0.5rem 1rem;
		position: relative;
	}

	.tip-message::before {
		content: "!";
		width: 2rem;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: var(--c-orange);
		color: var(--c-white);
		font-weight: 600;
		padding: 0.25rem;
		position: absolute;
		left: 0;
	}

	.tip-message p {
		color: var(--c-white);
		margin-left: 2rem;
		width: 100%;
	}

	.tip-message button {
		background: none;
		width: 1rem;
		height: 1rem;
		padding: 1rem;
	}

	form {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
		width: 100%;
	}

	label {
		color: var(--c-white);
		margin-bottom: 1rem;
	}

	label span {
		background-color: var(--c-orange);
		padding: 0.25rem 0.5rem;
		border-radius: 0.25rem;
		margin-left: 0.5rem;
	}

	.invalid-message {
		background-color: var(--c-container-stroke);
		padding: 0.25rem 0.5rem;
		border-radius: 0.25rem;
		margin-left: 0.5rem;
	}

	.success-message {
		background-color: greenyellow;
	}

	.error-message {
		background-color: red;
	}

	.display-none {
		display: none;
	}

	input {
		width: 100%;
		padding: 0.5rem 1rem;
		display: inline-block;
		border-radius: 0.25rem;
		margin-bottom: 1rem;
		font-size: 1rem;
		border: none;
	}

	input:focus, button:focus {
		outline: 0.1rem solid var(--c-orange);
	}

	input:read-only {
		background-color: var(--c-container-stroke);
		color: var(--c-white);
	}

	input:invalid {
		background-color: rgb(248, 178, 178);
		outline: 0.1rem solid red;
	}

	.button-div {
		display: flex;
		flex-direction: row;
		gap: 1rem;
		width: 100%;
	}

	button {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		font-size: 1rem;
		border: none;
		color: var(--c-white);
		padding: 0.5rem 1rem;
		cursor: pointer;
		transition: 0.2s ease;
		border-radius: 0.25rem;
		width: 50%;
	}

	.add-button {
		background-color: var(--c-pink);
	}

	.remove-button {
		background-color: var(--c-container-stroke);
	}

	.add-button:before, .remove-button::before {
		content: "";
		display: inline-block;
		width: 1rem;
		height: 1rem;
		background-position: center;
		background-size: contain;
		background-repeat: no-repeat;
		margin-right: 0.5rem;
	}

	.add-button::before {
		background-image: url("/icons/send.svg");
	}

	.remove-button::before {
		background-image: url("/icons/close.svg");
	}

	.add-button:hover {
		opacity: 0.75;
	}

	.remove-button:hover {
		opacity: 0.75;
	}
</style>
