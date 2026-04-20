<script>
	import AccountIcon from '$lib/components/icons/accountIcon.svelte';
	import NavButton from '$lib/components/NavButton.svelte';
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

	<h2>{data.user.username}</h2>
	<h2 class="user-title color-neutral-white">{data.user.email}</h2>
	<NavButton on:click={handleSignOut} variant="primary" size="large">Sign out</NavButton>
</div>

<style>
	.account-card {
		background-color: var(--light-2);
		border-radius: var(--border-radius);
		padding: 40px 124px;
		margin: 10% auto 0 auto;
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 70%;
		box-sizing: border-box;
	}

	.logo-box {
		background-color: var(--color-neutral-white);
		width: 12vh;
		height: 12vh;
		border-radius: var(--border-radius);
		display: flex;
		justify-content: center;
		align-items: center;
		margin-bottom: 20px;
	}

	h2 {
		margin: 0 0 24px 0;
		color: var(--color-neutral-white); 
	}

	.logo-text {
		font-size: 1.5rem;
		font-weight: 800;
		display: flex;
		align-items: center;
	}

	.user-title {
		max-width: 100%;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.logo-text :global(svg) {
		width: 50px;
		height: 50px;
		color: var(--color-neutral-black);
	}

	.logo-text :global(.btn-icon) {
		width: 50px;
		height: 50px;
		color: var(--color-neutral-black);
	}
</style>
