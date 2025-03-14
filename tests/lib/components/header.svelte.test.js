import { describe, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import { fireEvent } from '@testing-library/svelte';
import Header from '$lib/components/header.svelte';

describe('/header.svelte', () => {
	it('switches logo correctly between dark and light mode', async () => {
		// Render Header component with empty props
		render(Header, {
			props: {
				params: {},
				partners: { websites: [] },
				websites: { urls: [] }
			}
		});

		// Get logo image and toggle button
		const logoImage = screen.getByAltText('Logo van Vervoerregio Amsterdam');
		const toggleButton = screen.getByLabelText('lightmode');

		// Check initial logo (dark mode)
		expect(logoImage.src).toContain('logoDarkMode.svg');

		// Toggle to light mode
		await fireEvent.click(toggleButton);
		expect(logoImage.src).toContain('logoLightMode.svg');

		// Toggle back to dark mode
		await fireEvent.click(toggleButton);
		expect(logoImage.src).toContain('logoDarkMode.svg');
	});

	it('should add and remove lightmode class on body when toggling light mode', async () => {
		// Render Header component with empty props
		render(Header, {
			props: {
				params: {},
				partners: { websites: [] },
				websites: { urls: [] }
			}
		});

		// Get toggle button
		const toggleButton = screen.getByLabelText('lightmode');

		// Check initial state (dark mode)
		expect(document.body.classList.contains('lightmode')).toBe(false);

		// Toggle to light mode
		await fireEvent.click(toggleButton);
		expect(document.body.classList.contains('lightmode')).toBe(true);

		// Toggle back to dark mode
		await fireEvent.click(toggleButton);
		expect(document.body.classList.contains('lightmode')).toBe(false);
	});

	it('should save light mode state to localStorage', async () => {
		// Render Header component with empty props
		render(Header, {
			props: {
				params: {},
				partners: { websites: [] },
				websites: { urls: [] }
			}
		});

		// Get toggle button
		const toggleButton = screen.getByLabelText('lightmode');

		// Check initial state (dark mode)
		expect(localStorage.getItem('lightMode')).toBe('false');

		// Toggle to light mode
		await fireEvent.click(toggleButton);
		expect(localStorage.getItem('lightMode')).toBe('true');

		// Toggle back to dark mode
		await fireEvent.click(toggleButton);
		expect(localStorage.getItem('lightMode')).toBe('false');
	});
});
