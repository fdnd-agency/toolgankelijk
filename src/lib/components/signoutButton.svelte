<script>
    async function handleSignOut(event) {
		event.preventDefault();
		await fetch('/logout', { method: 'POST' });
		window.location.href = '/login';
	}
</script>

<button onclick={handleSignOut} class="signout-btn">Sign out</button>

<style>
    .signout-btn {
		background-color: var(--color-primary);
		color: var(--color-neutral-white);
		border: 2px solid var(--color-primary);
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
		color: var(--color-primary);
		border: 2px solid var(--color-primary);
	}
</style>