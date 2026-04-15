<script>
	import { enhance } from '$app/forms';
	import walking from '$lib/assets/walking_together.svg';
	import knowledge from '$lib/assets/sharing_knowledge.svg';
	import NavButton from '$lib/components/NavButton.svelte';
	let { data } = $props();
	console.log(data);

	let successMessage = $state('');
	let errorMessage = $state('');

	function handleEnhance({ formElement }) {
		const handleSubmit = async ({ result }) => {
			isSubmitting = false;
			successMessage = 'Verzonden!';

			if (result.type === 'failure') {
				errorMessage = 'Er is iets fout gegaan';
				errorMessage = result.data.data.error;
			} else {
				formElement.reset();
				successMessage = result.data.data.message;
			}
		};
		return handleSubmit;
	}

	async function handleSignOut(event) {
		event.preventDefault();
		await fetch('/logout', { method: 'POST' });
		window.location.href = '/login';
	}
</script>

<div class="account-card">
	<h1>Username: {data.user.username}</h1>

	<button on:click={handleSignOut} class="signout-btn">Sign out</button>
</div>

<style>
	.signout-btn {
		background-color: #b5006c;
		color: var(--c-white);
		border: 2px solid #b5006c;
		border-radius: 20px;
		width: 8rem;
		height: 2.2rem;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition:
			background 0.2s,
			color 0.2s,
			border 0.2s;
	}

	.signout-btn:hover {
		background-color: transparent;
		color: #b5006c;
		border: 2px solid #b5006c;
	}
</style>
