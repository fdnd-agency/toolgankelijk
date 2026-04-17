<script>
	import { page } from '$app/stores';
	import NavButton from './NavButton.svelte';
	import BreadCrumbs from './breadCrumbs.svelte';
	import Input from '$lib/components/input.svelte';

	let {params, 
		partners, 
		websites, 
		principles, 
		user = null,
		showAdd = false,
		onAdd
	} = $props();

	// Internal state for the form fields
	// let principle = $state('All');
	// let level = $state('All');
	// let showNotMet = $state(false);
	// let showMet = $state(false);

	// function handleSubmit(e) {
	// 	if (e) e.preventDefault();

	// 	if (onApply) {
	// 		onApply({
	// 			principle,
	// 			level,
	// 			showNotMet,
	// 			showMet
	// 		});
	// 	}
	// }
</script>

<div class="subheader">
	{#if user && user.isEmailVerified}
		<BreadCrumbs {params} {partners} {websites} {principles} width="full" />
	{/if}


	<div class="subheader-form">

	{#if showAdd}
	<NavButton
        size="small"
        variant="primary"
        showIcon={true}
        iconName="add"
		onclick={onAdd}
    ></NavButton>
	{/if}

	<form>
	<Input
	showIcon={true}
	iconName="search"
	size="full"
	/>
	</form>
	</div>


<!-- this will be placed on a sidebar of the principles page -->
	<!-- <div class="brand"></div>
	<form class="controls-container" onsubmit={handleSubmit}>
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

		<div class="button-container">
			<NavButton size="medium" type="submit" variant="secondary">Toepassen</NavButton>
		</div>
	</form> -->
</div>

<!-- <style>

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
		color: var(--color-neutral-white);
	}

	.select-wrapper {
		position: relative;
		display: inline-block;
	}

	select {
		appearance: none;
		-webkit-appearance: none;
		background-color: var(--color-primary-light);
		color: var(--color-neutral-black);
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
		color: var(--color-primary);
		position: absolute;
		right: 14px;
		top: 50%;
		transform: translateY(-50%);
		pointer-events: none;
	}

	label {
		color: var(--color-neutral-white);
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
		background-color: var(--color-neutral-white);
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

	@media (max-width: 850px) {
		.subheader {
			flex-direction: column;
			align-items: stretch;
			gap: 1.5rem;
		}

		.brand {
			display: none;
		}

		.controls-container {
			flex-direction: column;
			width: 100%;
			gap: 16px;
		}

		.control-group {
			width: 100%;
		}

		.select-wrapper {
			display: block;
		}

		select {
			width: 100%;
			box-sizing: border-box;
		}

		.checkboxes {
			flex-direction: row;
			gap: 1.5rem;
		}
	}
</style> -->

<style>
	.subheader {
		height: fit-content;
		background-color: var(--color-primary-light);
		display: flex;
		padding: 1em;
		align-content: center;
		justify-content: space-around;
	}

	.subheader-form {
		display: flex;
		gap: 1em;
	}
</style>