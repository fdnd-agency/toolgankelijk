<script>
	import { afterUpdate } from 'svelte';

	export let itemArray = [];

	let logCount = 0;
	let logList;
	let prevLen = 0;

	$: logCount = itemArray.length;

	afterUpdate(() => {
		// scroll alleen als er écht nieuwe items zijn toegevoegd
		if (itemArray.length > prevLen && logList) {
			logList.scrollTop = logList.scrollHeight;
			prevLen = itemArray.length;
		}
	});
</script>

<details class="loader-container" aria-hidden="true" open>
	<summary>Logs ({logCount})</summary>
	<ul class="log-list" role="log" aria-live="polite" bind:this={logList}>
		{#each itemArray as item}
			<li class="log-item {item.type}">
				{#if item.type === 'loading'}
					<span class="loader" />
				{:else}
					<img src="/icons/{item.type}.svg" alt={item.type} width="16" height="16" />
				{/if}
				{item.status}
			</li>
		{/each}
	</ul>
</details>

<style>
	.loader-container {
		width: 100%;
		border-radius: 0.25rem;
		margin-top: 1rem;
		color: var(--c-white);
	}

	.log-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		width: 100%;
		margin-top: 0.5rem;
		max-height: 20rem;
		overflow-y: auto;
	}

	.log-item {
		display: flex;
		flex-direction: row;
		justify-content: start;
		align-items: center;
		background-color: var(--c-container-stroke);
		border-radius: 0.25rem;
		color: var(--c-white);
		padding: 0.5rem 1rem;
		width: 100%;
	}

	img {
		margin-right: 0.5rem;
	}

	.done {
		background-color: rgb(223, 253, 220);
		color: rgb(64, 154, 0);
	}

	.warning {
		background-color: rgb(253, 247, 220);
		color: rgba(154, 96, 0);
	}

	.error {
		background-color: rgb(253, 220, 220);
		color: rgb(154, 0, 0);
	}

	.loading {
		background-color: var(--c-container-stroke);
		color: var(--c-orange);
	}

	.loader {
		width: 1rem;
		height: 1rem;
		border: 0.1rem solid var(--c-orange);
		border-bottom-color: transparent;
		border-radius: 50%;
		display: inline-block;
		box-sizing: border-box;
		animation: rotation 1s linear infinite;
		margin-right: 0.5rem;
	}

	@keyframes rotation {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
