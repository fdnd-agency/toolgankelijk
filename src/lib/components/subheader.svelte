<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import NavButton from './NavButton.svelte';

	let { data, partnerTitle = '', onApply } = $props();

	let principle = 'All';
	let level = 'All';
	let showNotMet = false;
	let showMet = false;

	function handleApply() {
		if (onApply) {
			onApply({
				principle,
				level,
				showNotMet,
				showMet
			});
		}
	}
</script>

<header class="subheader">
	<!--empty div to space out the controls to the right, logo resided in empty brand div originally-->
	<div class="brand"></div>

	<form class="controls-container" on:submit|preventDefault={handleApply}>
		<div class="control-group">
			<label class="group-label" for="principle">Selecteer principe:</label>
			<div class="select-wrapper">
				<select id="principle" bind:value={principle}>
					<option value="All">Alle Principes</option>
					<option value="Waarneembaar">Waarneembaar</option>
					<option value="Bedienbaar">Bedienbaar</option>
					<option value="Begrijpelijk">Begrijpelijk</option>
					<option value="Robuust">Robuust</option>
				</select>
			</div>
		</div>

		<div class="control-group">
			<label class="group-label" for="level">Selecteer niveau:</label>
			<div class="select-wrapper">
				<select id="level" bind:value={level}>
					<option value="All">Alle Niveaus</option>
					<option value="A">Niveau A</option>
					<option value="AA">Niveau AA</option>
					<option value="AAA">Niveau AAA</option>
				</select>
			</div>
		</div>

		<fieldset class="control-group" style="border: none; padding: 0; margin: 0; min-width: 0;">
			<legend class="group-label">Principes tonen:</legend>
			<div class="checkboxes">
				<label class="checkbox-label">
					<input type="checkbox" bind:checked={showNotMet} />
					Niet voldaan
				</label>
				<label class="checkbox-label">
					<input type="checkbox" bind:checked={showMet} />
					Voldaan
				</label>
			</div>
		</fieldset>
	</form>
	<NavButton size="medium" , type="submit">Toepassen</NavButton>
</header>

<style>
	.subheader {
		/* Replaced #b62059 with primary */
		background-color: var(--color-primary);
		/* neutral-black flips between white/black automatically */
		color: var(--color-neutral-black);
		font-family: 'Fira Sans Regular', sans-serif;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: clamp(1em, 6vw, 2em);
		margin: 1em 1em;
		border-radius: var(--border-radius);
		border-bottom-left-radius: 20px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	.brand {
		flex: 1;
		padding-right: 20px;
	}

	.controls-container {
		display: flex;
		align-items: flex-start;
		gap: 24px;
		padding: 0.3em;
	}

	.control-group {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.group-label {
		font-size: 0.9rem;
		color: inherit; /* Follows the header text color */
	}

	.select-wrapper {
		position: relative;
		display: inline-block;
	}

	select {
		appearance: none;
		-webkit-appearance: none;
		/* Using primary-light for the dropdown background */
		background-color: var(--color-primary-light);
		color: var(--color-neutral-white); /* High contrast text */
		border: none;
		padding: 10px 40px 10px 16px;
		border-radius: 6px;
		font-size: 0.95rem;
		cursor: pointer;
		min-width: 180px;
	}

	select:focus {
		outline: 2px solid var(--color-neutral-black);
	}

	.select-wrapper::after {
		content: '▼';
		font-size: 0.6rem;
		/* Arrow matches the deep primary color */
		color: var(--color-primary);
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
		color: inherit;
	}

	input[type='checkbox'] {
		appearance: none;
		-webkit-appearance: none;
		width: 16px;
		height: 16px;
		background-color: var(--color-neutral-black); /* Box flips color */
		border-radius: 2px;
		cursor: pointer;
		margin: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	input[type='checkbox']:checked::after {
		content: '✔';
		/* Checkmark uses the background color to "cut out" */
		color: var(--color-primary);
		font-size: 12px;
		font-weight: bold;
	}

	.apply-btn {
		/* Use the darker neutral grey or primary for the button */
		background-color: var(--color-neutral-darkgrey);
		color: var(--color-neutral-black);
		border: 1px solid rgba(255, 255, 255, 0.1);
		padding: 10px 24px;
		border-radius: 6px;
		font-size: 0.95rem;
		font-weight: bold;
		cursor: pointer;
		transition: 0.2s;
		height: fit-content;
		margin-top: 25px;
	}

	.apply-btn:hover {
		filter: brightness(1.1);
		background-color: var(--color-accent-secondary);
		color: white;
	}
</style>
