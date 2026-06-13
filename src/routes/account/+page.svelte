<script>
	// the account page shows info of your account you can sign out here
	import AccountIcon from '$lib/components/atoms/icons/accountIcon.svelte';
	import NavButton from '$lib/components/molecules/navButton.svelte';
	let { data } = $props();

	// signout function with preventdefault so the page won't refresh
	async function handleSignOut(event) {
		event.preventDefault();
		await fetch('/logout', { method: 'POST' });
		window.location.href = '/login';
	}
</script>

<div class="banner-account">
</div>

<div class="account-elements">
	<div class="logo-box">
		<span class="logo-text">
			<AccountIcon class="btn-icon"></AccountIcon>
		</span>
	</div>

	<h2>{data.user.username}</h2>
	<h2 class="user-title color-neutral-white">{data.user.email}</h2>

	<NavButton 
		onclick={handleSignOut} 
		showIcon={true}
		iconName="account"
		variant="primary" 
		size="large">
		Sign out
	</NavButton>
</div>

<style>

	.banner-account {
		background-color: var(--color-primary-light-2);
		height: 30vh;
		width: 100vw;
		margin-left: -5.5%;
	}

	.account-elements {
		width: 100%;
		gap: 1em;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-top: -10em;
	}

	.logo-box {
		background-color: var(--color-neutral-white);
		width: 25vh;
		height: 25vh;
		border: var(--color-neutral-black) 1px solid;
		border-radius: var(--border-radius);
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
