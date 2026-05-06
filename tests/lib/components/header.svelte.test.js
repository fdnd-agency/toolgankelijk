import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/svelte';
import Header from '$lib/components/header.svelte';

const mockedPageState = vi.hoisted(() => ({ pathname: '/' }));

vi.mock('$app/stores', () => ({
	page: {
		subscribe(run) {
			run({ url: new URL(`http://localhost${mockedPageState.pathname}`) });
			return () => {};
		}
	}
}));

describe('/header.svelte', () => {
	beforeEach(() => {
		mockedPageState.pathname = '/';
	});

	it('renders skip link and main navigation links', () => {
		render(Header, {
			props: {
				params: {},
				partners: { websites: [] },
				websites: { urls: [] },
				principles: []
			}
		});

		expect(screen.getByRole('link', { name: 'Jump directly to main content' })).toBeTruthy();
		expect(screen.getByRole('link', { name: 'Home' })).toBeTruthy();
		expect(screen.getByRole('link', { name: 'Info' })).toBeTruthy();
		expect(screen.getByRole('link', { name: 'Account' })).toBeTruthy();
	});

	it('sets active class on nav item based on current pathname', () => {
		mockedPageState.pathname = '/info';

		render(Header, {
			props: {
				params: {},
				partners: { websites: [] },
				websites: { urls: [] },
				principles: []
			}
		});

		const homeLink = screen.getByRole('link', { name: 'Home' });
		const infoLink = screen.getByRole('link', { name: 'Info' });
		const accountLink = screen.getByRole('link', { name: 'Account' });

		expect(homeLink.className.includes('active')).toBe(false);
		expect(infoLink.className.includes('active')).toBe(true);
		expect(accountLink.className.includes('active')).toBe(false);
	});

	it('does not render breadcrumbs for unverified users', () => {
		const { container } = render(Header, {
			props: {
				params: {},
				partners: { websites: [] },
				websites: { urls: [] },
				principles: [],
				user: { isEmailVerified: false }
			}
		});

		expect(container.querySelector('.breadcrumbs')).toBeNull();
	});

	it('renders breadcrumbs for verified users', async () => {
		const { container } = render(Header, {
			props: {
				params: {},
				partners: { websites: [] },
				websites: { urls: [] },
				principles: [],
				user: { isEmailVerified: true }
			}
		});

		await waitFor(() => {
			expect(container.textContent ?? '').toContain('Partners overzicht');
		});
	});
});
