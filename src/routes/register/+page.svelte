<script>
	import { enhance } from '$app/forms';

	export let form;
</script>

<svelte:head>
	<title>Create Account · Vervoerregio Amsterdam</title>
</svelte:head>

<section class="form-container">
	<form method="post" action="?/register" use:enhance>
		<fieldset class="form-login">
			<legend>Create an account</legend>
			<p>
				<label for="email">Email</label>
				<input id="email" type="email" name="email" placeholder="Email" required />
			</p>
			<p>
				<label for="username">Username</label>
				<input
					id="username"
					type="text"
					name="username"
					placeholder="Username"
					autocomplete="on"
					required
				/>
			</p>
			<p>
				<label for="password">Password</label>
				<input
					id="password"
					type="password"
					name="password"
					placeholder="Password"
					autocomplete="off"
					required
				/>
			</p>
			<p>
				<label for="confirm-password">Confirm Password</label>
				<input
					id="confirm-password"
					type="password"
					name="confirm-password"
					placeholder="Password"
					autocomplete="off"
					required
				/>
			</p>
			<button type="submit" class="form-submit">Create</button>
			<p style="color: red;">{form?.message ?? ''}</p>
		</fieldset>
	</form>
</section>

<style>
	.form-container {
		display: flex;
		justify-content: center;
		margin-top: 3rem;
	}

	.form-login {
		display: flex;
		flex-direction: column;
		align-items: center;
		background-color: var(--c-container);
		width: 18rem;
		border-color: var(--c-pink);
		border-radius: 10px;
		padding-left: 2rem;
		padding-right: 2rem;
		padding-top: 1rem;
		padding-bottom: 1.5rem;
	}

	legend {
		color: var(--c-white);
		padding-top: 2.5rem;
		text-align: center;
		font-size: 28px;
	}

	p {
		display: flex;
		flex-direction: column;
		padding-top: 1rem;
	}

	label {
		padding-bottom: 0.3rem;
		font-size: 16px;
	}

	input {
		background-color: var(--c-container-stroke);
		border: none;
		height: 2.5rem;
		width: 15rem;
		padding-left: 0.5rem;
		color: white;
		font-size: 16px;
	}

	input:user-invalid {
		border: 1px solid red;
	}

	input:focus {
		outline: none;
		border: 1px solid var(--c-white);
	}

	.form-submit {
		margin-top: 2rem;
		margin-bottom: 1rem;
		background-color: var(--c-pink);
		color: var(--c-white);
		border: 2px solid var(--c-pink);
		width: 10rem;
		height: 2.5rem;
		border-radius: 20px;
		cursor: pointer;
		transition: 0.2s ease-in-out;
		font-size: 16px;
	}

	.form-submit:hover {
		background-color: transparent !important;
	}

	@media screen and (max-width: 380px) {
		.form-login {
			padding-left: 1rem;
			padding-right: 1rem;
		}
	}
</style>
