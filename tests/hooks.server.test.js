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
		expect(event.locals.user).toBeNull();
		expect(event.locals.session).toBeNull();
		expect(resolve).toHaveBeenCalled();
	});

	it('should set session and user if token is valid', async () => {
		// Arrange
		event.cookies.get.mockReturnValue('token');
		vi.spyOn(sessionModule, 'validateSessionToken').mockResolvedValue({
			session: { houdbaarTot: new Date(Date.now() + 10000) },
			user: { id: '1' }
		});
		const setCookie = vi.spyOn(sessionModule, 'setSessionTokenCookie').mockImplementation(() => {});

		// Act
		await handle({ event, resolve });

		// Assert
		expect(event.locals.session).toBeTruthy();
		expect(event.locals.user).toBeTruthy();
		expect(setCookie).toHaveBeenCalled();
		expect(resolve).toHaveBeenCalled();
	});

	it('should delete session cookie if token is invalid', async () => {
		// Arrange
		event.cookies.get.mockReturnValue('token');
		vi.spyOn(sessionModule, 'validateSessionToken').mockResolvedValue({
			session: null,
			user: null
		});
		const deleteCookie = vi
			.spyOn(sessionModule, 'deleteSessionTokenCookie')
			.mockImplementation(() => {});

		// Act
		await handle({ event, resolve });

		// Assert
		expect(event.locals.session).toBeNull();
		expect(event.locals.user).toBeNull();
		expect(deleteCookie).toHaveBeenCalled();
		expect(resolve).toHaveBeenCalled();
	});
});
