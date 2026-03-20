<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

  let { data } = $props();

	let principe = 'Waarneembaar';
	let niveau = 'Niveau A';
	let showNietVoldaan = false;
	let showVoldaan = false;

	function handleApply() {
		console.log('Filters ready to apply:', {
			principe: principe,
			niveau: niveau,
			nietVoldaan: showNietVoldaan,
			voldaan: showVoldaan
		});

		alert(`Testing! You selected: ${principe} and ${niveau}`);
	}
</script>

<div
	style="background-color: #b62059; margin: 1em 1em; padding: clamp(1em, 6vw, 2em); border-radius: 0.5em;"
>
	<h2>titel</h2>

	<div style="margin-bottom: 15px;">
		<label>
			Selecteer principe:
			<select bind:value={principe}>
				<option>Waarneembaar</option>
				<option>Bedienbaar</option>
				<option>Begrijpelijk</option>
			</select>
		</label>
	</div>

	<div style="margin-bottom: 15px;">
		<label>
			Selecteer niveau:
			<select bind:value={niveau}>
				<option>Niveau A</option>
				<option>Niveau AA</option>
				<option>Niveau AAA</option>
			</select>
		</label>
	</div>

	<div style="margin-bottom: 15px;">
		<span>Principes tonen:</span>
		<label>
			<input type="checkbox" bind:checked={showNietVoldaan} />
			Niet voldaan
		</label>
		<label>
			<input type="checkbox" bind:checked={showVoldaan} />
			Voldaan
		</label>
	</div>

	<button on:click={handleApply} style="padding: 10px 20px; cursor: pointer;"> Toepassen </button>
</div>
