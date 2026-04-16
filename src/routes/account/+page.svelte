<script>
	import AccountIcon from '$lib/components/icons/accountIcon.svelte';
	let { data } = $props();

	async function handleSignOut(event) {
		event.preventDefault();
		await fetch('/logout', { method: 'POST' });
		window.location.href = '/login';
	}
</script>

<div class="account-card color-primary">
	<div class="logo-box">
		<span class="logo-text">
			<AccountIcon class="btn-icon"></AccountIcon>
		</span>
	</div>

	<h2 class="user-title">{data.user.username}</h2>
	<h2 class="user-title">{data.user.email}</h2>
	<button on:click={handleSignOut} class="signout-btn"> Sign out </button>
</div>

<style>
	.account-card {
		background-color: var(--light-2);
		border-radius: 8px;
		padding: 40px 124px;
		margin: 10% auto 0 auto;
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 70%;
		box-sizing: border-box;
	}

	.logo-box {
		background-color: white;
		width: 12vh;
		height: 12vh;
		border-radius: 12px;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-bottom: 20px;
	}

	.logo-text {
		font-size: 1.5rem;
		font-weight: 800;
		display: flex;
		align-items: center;
	}

	.user-title {
		margin: 0 0 24px 0;
	}

	.signout-btn {
		background-color: #f1d5e3;
		border-radius: 24px;
		padding: 8px 32px;
		font-size: 1rem;
		font-weight: 700;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 8px;
		transition: opacity 0.2s;
		border: 2px solid black;
		color: black;
	}

	.signout-btn:hover {
		background-color: transparent;
		color: #b5006c;
		opacity: 0.9;
	}
	.logo-text :global(svg) {
		width: 50px;
		height: 50px;
		color: black;
	}

	.logo-text :global(.btn-icon) {
		width: 50px;
		height: 50px;
		color: #000000;
	}
</style>
