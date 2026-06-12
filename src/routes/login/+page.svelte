<script>
	import { enhance } from '$app/forms';
	import NavButton from '$lib/components/molecules/navButton.svelte';

	let { form } = $props();
</script>

<svelte:head>
	<title>Login · Vervoerregio Amsterdam</title>
</svelte:head>

<section class="form-container">
	<div class="form-background">
		<form method="post" action="?/signin" use:enhance>
			<div class="form-login">
				<h1 class="form-title">Inloggen</h1>

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

				<p class="error-message">{form?.message ?? ''}</p>

				<div class="form-link">
					<span class="text-account">Nog geen account?</span>
					<a class="link-account" href="/register">Registreren</a>
				</div>
			</div>
		</form>
	</div>
</section>

<style>
	.form-container {
		display: flex;
		justify-content: center;
		padding: 3rem 1rem;
	}

	.form-background {
		background-color: var(--color-primary);
		padding: 4rem 2rem;
		width: 100%;
		max-width: 45rem;
		border-radius: var(--border-radius);
	}

	form {
		width: 100%;
		display: flex;
		justify-content: center;
	}

	.form-login {
		display: flex;
		gap: 1em;
		flex-direction: column;
		align-items: center;
		background-color: var(--color-neutral-white);
		border: none;
		border-radius: var(--border-radius);
		padding: 3rem 2.5rem;
		width: 100%;
		max-width: 26rem;
	}

	.form-title {
		color: var(--color-primary);
		text-align: center;
		font-size: 2.2rem;
		font-weight: 700;
		margin: 0 0 1rem 0;
	}

	span::before {
		content: ' ';
	}

	.error-message {
		color: red;
		padding-top: 0;
	}

	input {
		background-color: var(--color-neutral-white);
		border: 1px solid var(--color-neutral-grey);
		border-radius: 8px;
		height: 3.2rem;
		width: 100%;
		padding: 0 1rem;
		font-size: 1rem;
		color: var(--color-neutral-black);
		box-sizing: border-box;
		transition: all 0.2s ease-in-out;
	}

	input::placeholder {
		color: var(--color-neutral-black);
	}

	input:focus {
		border-color: var(--color-primary);
		box-shadow: 0 0 0 4px var(--color-primary-light);
		outline: none;
	}

	span::before {
		content: ' ';
		display: block;
	}

	input:user-invalid {
		border-color: red;
		background-color: #fff5f5;
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

	/* --- Links & Footer --- */
	.form-link {
		padding-top: 1.5rem;
		display: flex;
		gap: 0.4rem;
		color: var(--color-neutral-darkgrey);
		font-size: 0.9rem;
	}

	a:hover {
		color: var(--color-neutral-darkgrey);
		text-decoration: underline;
	}

	.link-password {
		align-self: flex-end;
		padding-top: 0.5rem;
	}

	/* --- Media Queries & Animations --- */
	@media screen and (max-width: 480px) {
		.form-login {
			padding: 2rem 1.5rem;
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
