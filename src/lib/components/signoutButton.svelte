<script>

</script>

<button onclick={handleSignOut} class="signout-btn">Sign out</button>

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