<script>
    export let amount;

    // create an array on basis of the amount value
    let numbers = Array.from({ length: amount }, (_, i) => i + 1);
</script>

<ul class="pages-list">
    {#each numbers as n}
    <li><button type="button" value={n}>{n}</button></li>
    {/each}
</ul>

<style>
    .pages-list {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		gap: 0.5rem;
        list-style-type: "";
	}

	.pages-list li button {
		border-radius: 0.25em;
		padding: 0.5em 1em;
		color: var(--c-white2);
		background-color: var(--c-modal-button);
		border: none;
		font-weight: 600;
		font-size: 1em;
		transition: 0.3s;
		cursor: pointer;
	}
</style>