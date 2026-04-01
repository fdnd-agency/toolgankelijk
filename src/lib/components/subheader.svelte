<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	let { data, partnerTitle = '', onApply } = $props();

	let principe = 'Alle';
	let niveau = 'Alle';
	let showNietVoldaan = false;
	let showVoldaan = false;

	function handleApply() {
		if (onApply) {
			onApply({
				principe,
				niveau,
				showNietVoldaan,
				showVoldaan
			});
		}
	}
</script>

<div class="subheader">
	<div class="brand">
	</div>

	<div class="controls-container">
		<div class="control-group">
			<label class="group-label" for="principe">Selecteer principe:</label>
			<div class="select-wrapper">
				<select id="principe" bind:value={principe}>
					<option value="Alle">Alle Principes</option>
					<option value="Waarneembaar">Waarneembaar</option>
					<option value="Bedienbaar">Bedienbaar</option>
					<option value="Begrijpelijk">Begrijpelijk</option>
					<option value="Robuust">Robuust</option>
				</select>
			</div>
		</div>

		<div class="control-group">
			<label class="group-label" for="niveau">Selecteer niveau:</label>
			<div class="select-wrapper">
				<select id="niveau" bind:value={niveau}>
					<option value="Alle">Alle Niveaus</option>

					<option value="A">Niveau A</option>
					<option value="AA">Niveau AA</option>
					<option value="AAA">Niveau AAA</option>
				</select>
			</div>
		</div>

		<div class="control-group">
			<span class="group-label">Principes tonen:</span>
			<div class="checkboxes">
				<label class="checkbox-label">
					<input type="checkbox" bind:checked={showNietVoldaan} />
					Niet voldaan
				</label>
				<label class="checkbox-label">
					<input type="checkbox" bind:checked={showVoldaan} />
					Voldaan
				</label>
			</div>
		</div>

		<button on:click={handleApply} class="apply-btn">Toepassen</button>
	</div>
</div>

<style>
	.subheader {
		background-color: #b62059;
		color: white;
		font-family:
			system-ui,
			-apple-system,
			sans-serif;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 16px 32px;
		border-radius: 8px;
		border-bottom-left-radius: 20px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		background-color: #b62059;
		margin: 1em 1em;
		padding: clamp(1em, 6vw, 2em);
		border-radius: 0.5em;
	}

	.brand {
		flex: 1;
		padding-right: 20px;
	}

	.brand h2 {
		margin: 0;
		font-size: 1.8rem;
		font-weight: bold;
	}

	.controls-container {
		display: flex;
		align-items: flex-start;
		gap: 24px;
	}

	.control-group {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.group-label {
		font-size: 0.9rem;
		color: white;
	}

	.select-wrapper {
		position: relative;
		display: inline-block;
	}

	select {
		appearance: none;
		-webkit-appearance: none;
		background-color: #e6cbd8;
		color: #5c4351;
		border: none;
		padding: 10px 40px 10px 16px;
		border-radius: 6px;
		font-size: 0.95rem;
		cursor: pointer;
		min-width: 180px;
	}

	select:focus {
		outline: 2px solid white;
	}

	.select-wrapper::after {
		content: '▼';
		font-size: 0.6rem;
		color: #b62059;
		position: absolute;
		right: 14px;
		top: 50%;
		transform: translateY(-50%);
		pointer-events: none;
	}

	.checkboxes {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.checkbox-label {
		display: flex;
		align-items: center;
		gap: 10px;
		font-size: 0.85rem;
		cursor: pointer;
		color: white;
	}

	input[type='checkbox'] {
		appearance: none;
		-webkit-appearance: none;
		width: 16px;
		height: 16px;
		background-color: white;
		border-radius: 2px;
		cursor: pointer;
		margin: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	input[type='checkbox']:checked::after {
		content: '✔';
		color: #b62059;
		font-size: 12px;
		font-weight: bold;
	}

	.apply-btn {
		background-color: #8f1946;
		color: white;
		border: none;
		padding: 10px 24px;
		border-radius: 6px;
		font-size: 0.95rem;
		font-weight: bold;
		cursor: pointer;
		transition: background-color 0.2s;
		height: fit-content;
		margin-top: 25px;
	}

	.apply-btn:hover {
		background-color: #721438;
	}
</style>
