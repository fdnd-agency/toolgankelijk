<script>
	import { enhance } from '$app/forms';
	import walking from '$lib/assets/walking_together.svg';
	import knowledge from '$lib/assets/sharing_knowledge.svg';
	import NavButton from '$lib/components/NavButton.svelte';

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
</script>

<h1>Your Account</h1>
