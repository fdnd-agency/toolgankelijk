<script>
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
			<svg
				class="btn-icon"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
				<circle cx="12" cy="7" r="4"></circle>
			</svg>
		</span>
	</div>

	<h1 class="user-title">{data.user.username}</h1>
	<h1 class="user-title">{data.user.email}</h1>

	<button on:click={handleSignOut} class="signout-btn"> Sign out </button>
</div>

<style>
	.account-card {
		background-color: var(--light-2);
		border-radius: 8px;
		padding: 40px 100px;
		margin-top: 10%;
		display: flex;
		flex-direction: column;
		align-items: center;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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
		color: white;
		font-size: 1.5rem;
		font-weight: 700;
		margin: 0 0 24px 0;
	}

	.signout-btn {
		background-color: #f1d5e3;
		color: #000000;
		border: none;
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

	.btn-icon {
		width: 18px;
		height: 18px;
	}

	.logo-text > .btn-icon {
		width: 50px;
		height: 50px;
		color: #000000;
	}
</style>
