<script>
    export let process;
</script>

<div class="loader-container" aria-hidden="true">
    <span class="loader" aria-label="loading-icon"></span>
    <p>{process}</p>
</div>

<style>
    .loader-container {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		gap: 1rem;
		width: 100%;
		padding: 1rem 0;
		background-color: var(--c-container-stroke);
		border-radius: 0.25rem;
		margin-top: 1rem;
		color: var(--c-white);
		overflow: hidden;
	}

	.loader {
        width: 48px;
        height: 48px;
		border-radius: 50%;
		position: relative;
		transform:rotate(45deg);
		background: #fff;
	}
		
	.loader::before {
		content: "";
		box-sizing: border-box;
		position: absolute;
		inset: 0px;
		border-radius: 50%;
		border:24px solid var(--c-pink);
		animation: prixClipFix 2s infinite linear;
	}

	p {
		width: 80%;
	}

	@keyframes prixClipFix {
		0%   {clip-path:polygon(50% 50%,0 0,0 0,0 0,0 0,0 0)}
		25%  {clip-path:polygon(50% 50%,0 0,100% 0,100% 0,100% 0,100% 0)}
		50%  {clip-path:polygon(50% 50%,0 0,100% 0,100% 100%,100% 100%,100% 100%)}
		75%  {clip-path:polygon(50% 50%,0 0,100% 0,100% 100%,0 100%,0 100%)}
		100% {clip-path:polygon(50% 50%,0 0,100% 0,100% 100%,0 100%,0 0)}
	}
</style>