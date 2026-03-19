<script>
	import { enhance } from '$app/forms';
	import Heading from '$lib/components/heading.svelte';
	import walking from '$lib/assets/walking_together.svg';
	import knowledge from '$lib/assets/sharing_knowledge.svg';

	let heading = $derived({ titel: 'Informatie' });

	let isSubmitting = $state(false);
	let successMessage = $state('');
	let errorMessage = $state('');


</script>

<h1>You Account</h1>

<style>
	.text-container p {
		max-width: 50rem;
	}

	.top-container {
		grid-area: top;
		display: flex;
		align-items: flex-start;
		justify-content: flex-start;
	}

	.left-container {
		grid-area: left;
	}

	.right-container {
		grid-area: right;
	}

	.bot-left-container {
		grid-area: botleft;
		display: flex;
		align-items: flex-start;
		justify-content: flex-start;
	}

	.bot-right-container {
		grid-area: botright;
		display: flex;
		align-items: flex-start;
		justify-content: flex-start;
	}

	.content-container {
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-template-rows: 0.3fr 0.5fr 1fr 1fr;
		grid-template-areas:
			'top top'
			'left right'
			'botleft botright';
		margin: 1em 1em;
		gap: 1em;
	}

	.text-image {
		height: 13em;
	}

	.top-container,
	.left-container,
	.right-container,
	.bot-left-container,
	.bot-right-container {
		padding: 2em;
		background-color: var(--c-container);
		border-radius: 0.5em;
	}

	span {
		color: var(--c-pink);
	}

	.image-container {
		margin-left: auto;
		align-self: center;
	}

	.form-vraag {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		width: 18rem;
		background-color: var(--c-container);
		border: none;
		border-radius: 10px;
		padding-right: 2rem;
		padding-top: 1rem;
		padding-bottom: 1.5rem;
	}

	input {
		background-color: var(--c-container-stroke);
		border: none;
		height: 2.5rem;
		width: 15rem;
		padding-left: 0.5rem;
		color: white;
		font-size: 16px;
		margin-bottom: 0.7rem;
	}

	input:valid {
		border: 1px solid lightgreen;
		transition: 0.3s ease-out;
	}

	textarea:valid {
		border: 1px solid lightgreen;
		transition: 0.2s ease-out;
	}

	textarea {
		background-color: var(--c-container-stroke);
		border: none;
		height: 4rem;
		width: 15rem;
		padding-left: 0.5rem;
		color: white;
		font-size: 16px;
	}

	form:valid .form-button {
		background-color: var(--c-pink);
		border: 2px solid var(--c-pink);
	}

	.form-button {
		margin-top: 1rem;
		margin-bottom: 1rem;
		background-color: grey;
		color: lightgray;
		border: 2px solid grey;
		width: 10rem;
		height: 2.5rem;
		border-radius: 20px;
		cursor: pointer;
		transition: 0.2s ease-in-out;
		font-size: 16px;
	}

	.form-button:hover {
		background-color: transparent !important;
	}

	.success-message {
		color: green;
	}
	.error-message {
		color: red;
	}

	@media only screen and (max-width: 1100px) {
		.content-container {
			grid-template-columns: 1fr;
			grid-template-rows: 1fr 1fr 1fr 1fr;
			grid-template-areas:
				'top'
				'left'
				'right'
				'botleft'
				'botright';
		}

		.text-image {
			height: 10em;
		}
	}
</style>
