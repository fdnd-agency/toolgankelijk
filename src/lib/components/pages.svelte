<script>
    export let amount;
	export let perPage;

	// calculate the amount of pages on basis of the total urls
	$: pages = Math.ceil(amount / perPage);
	console.log(pages);

	// create an array on basis of the pages value to use it for the each loop
	$: pageNumbers = Array.from({ length: pages },(_, i) => i + 1);
</script>

<ul class="pages-list">
    {#each pageNumbers as p}
    <li><button type="submit" name="skip" value={(p - 1) * perPage}>{p}</button></li>
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