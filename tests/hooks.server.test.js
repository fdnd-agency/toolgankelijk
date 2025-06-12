import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as sessionModule from '$lib/server/session';
import { handle } from '../src/hooks.server.js';

describe('hooks.server.js', () => {
	let event, resolve;

	beforeEach(() => {
		event = {
			cookies: {
				get: vi.fn()
			},
			locals: {}
		};
		resolve = vi.fn((e) => e);
		vi.resetAllMocks();
	});

	it('should not set session if no token is present', async () => {
		// Arrange
		event.cookies.get.mockReturnValue(null);

		// Act
		await handle({ event, resolve });

		// Assert
		expect(event.locals.gebruiker).toBeNull();
		expect(event.locals.sessie).toBeNull();
		expect(resolve).toHaveBeenCalled();
	});

	it('should set session and user if token is valid', async () => {
		// Arrange
		event.cookies.get.mockReturnValue('token');
		vi.spyOn(sessionModule, 'validateSessionToken').mockResolvedValue({
			sessie: { houdbaarTot: new Date(Date.now() + 10000) },
			gebruiker: { id: '1' }
		});
		const setCookie = vi.spyOn(sessionModule, 'setSessionTokenCookie').mockImplementation(() => {});

		// Act
		await handle({ event, resolve });

		// Assert
		expect(event.locals.sessie).toBeTruthy();
		expect(event.locals.gebruiker).toBeTruthy();
		expect(setCookie).toHaveBeenCalled();
		expect(resolve).toHaveBeenCalled();
	});

	it('should delete session cookie if token is invalid', async () => {
		// Arrange
		event.cookies.get.mockReturnValue('token');
		vi.spyOn(sessionModule, 'validateSessionToken').mockResolvedValue({
			sessie: null,
			gebruiker: null
		});
		const deleteCookie = vi
			.spyOn(sessionModule, 'deleteSessionTokenCookie')
			.mockImplementation(() => {});

		// Act
		await handle({ event, resolve });

		// Assert
		expect(event.locals.sessie).toBeNull();
		expect(event.locals.gebruiker).toBeNull();
		expect(deleteCookie).toHaveBeenCalled();
		expect(resolve).toHaveBeenCalled();
	});
});
