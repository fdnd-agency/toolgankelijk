<script>
	import { enhance } from '$app/forms';
	import NavButton from '$lib/components/NavButton.svelte';

	let { form } = $props();
</script>

<svelte:head>
	<title>Login · Vervoerregio Amsterdam</title>
</svelte:head>

<section class="form-container">
	<div class="form-background">
		<form method="post" action="?/signin" use:enhance>
			<fieldset class="form-login">
				<legend>Inloggen</legend>


				<p>
					<input id="email" type="email" name="email" placeholder="Email" required />
					<span></span>
				</p>
				<p>
					<input
						id="password"
						type="password"
						name="password"
						minlength="6"
						placeholder="Wachtwoord"
						autocomplete="off"
						required
					/>
					<span></span>
					<a class="link-password" href="/info">Wachtwoord vergeten?</a>
				</p>

				<NavButton aria="Inloggen" size="medium" variant="primary" type="submit">Log in</NavButton>

				<p style="color: red; padding-top: 0;">{form?.message ?? ''}</p>

				<div class="form-link">
					<span class="text-account">Nog geen account?</span>
					<a class="link-account" href="/register">Registreren</a>
				</div>
			</fieldset>
		</form>
	</div>
</section>

<style>
	.form-container {
		display: flex;
		justify-content: center;
		margin-top: 3rem;
	}

	.form-background {
        background-color: var(--color-primary);
        padding: 3.5rem 4.5rem;
        width: 100%;
        max-width: 55rem;
        border-radius: var(--border-radius);
    }

	.form-login {
		display: flex;
		flex-direction: column;
		align-items: center;
		background-color: var(--color-primary-light);
		border-color: var(--color-primary);
		border-radius: var(--border-radius);
		padding-left: 2rem;
		padding-right: 2rem;
		padding-top: 1rem;
		padding-bottom: 1.5rem;
		border: none;
	}

	legend {
		color: var(--color-neutral-black);
		padding-top: 3.5rem;
		text-align: center;
		font-size: 38px;
		font-weight: bold;
	}

	p {
		display: flex;
		flex-direction: column;
		padding-top: 1rem;
	}

	span::before {
		content: ' ';
	}

	input:user-invalid + span::before {
		content: 'Invalid input';
		color: darkred;
		font-size: 12px;
	}

	input:user-invalid + span {
		animation: shake 0.6s ease-in-out;
	}

	label {
		padding-bottom: 0.3rem;
		font-size: 16px;
	}

	input {
		background-color: var(--color-neutral-white);
		border-radius: var(--border-radius);
		height: 2.8rem;
		width: 15rem;
		padding-left: 0.5rem;
		font-size: 16px;
	}

	input:user-invalid {
		border: 1px solid red;
		background-color: darkred;
		outline: none;
		animation: shake 0.6s ease-in-out;
	}

	input:user-invalid:focus {
		border: 1px solid red;
	}

	input:focus {
		border: 4px solid var(--color-primary);
		transition-duration: 0.2s;
		outline: none;
	}

	.form-link {
		padding-top: 1rem;
		padding-bottom: 0;
	}

	a {
		font-size: 12px;
		color: var(--color-primary);
	}

	.link-account {
		padding-right: 1rem;
	}

	.link-password {
		padding-left: 0.5rem;
	}

	@media screen and (max-width: 380px) {
		.form-login {
			padding-left: 1rem;
			padding-right: 1rem;
		}
	}

	@keyframes shake {
		0% {
			transform: rotate(0deg);
		}

		10% {
			transform: rotate(2deg);
		}

		20% {
			transform: rotate(2deg);
		}

		30% {
			transform: rotate(-2deg);
		}

		40% {
			transform: rotate(2deg);
		}

		50% {
			transform: rotate(-2deg);
		}

		60% {
			transform: rotate(2deg);
		}

		70% {
			transform: rotate(-2deg);
		}

		80% {
			transform: rotate(2deg);
		}

		90% {
			transform: rotate(-2deg);
		}

		100% {
			transform: rotate(0deg);
		}
	}
</style>
