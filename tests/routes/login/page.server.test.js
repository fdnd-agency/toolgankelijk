import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as userModule from '$lib/server/user';
import * as passwordModule from '$lib/server/password';
import * as emailModule from '$lib/server/email';
import * as sessionModule from '$lib/server/session';
import { actions } from '../../../src/routes/login/+page.server.js';

describe('src/routes/login/+page.server.js', () => {
	let event;

	beforeEach(() => {
		event = {
			request: {
				formData: vi.fn()
			}
		};
		vi.resetAllMocks();
	});

	it('fails if email or password is missing', async () => {
		event.request.formData.mockResolvedValue({
			get: (key) => (key === 'email' ? '' : '')
		});
		const result = await actions.signin(event);
		expect(result.status).toBe(400);
		expect(result.data.message).toBe('Please enter your email and password');
	});

	it('fails if email is invalid', async () => {
		event.request.formData.mockResolvedValue({
			get: (key) => (key === 'email' ? 'notanemail' : 'password')
		});
		vi.spyOn(emailModule, 'verifyEmailInput').mockReturnValue(false);
		const result = await actions.signin(event);
		expect(result.status).toBe(400);
		expect(result.data.message).toBe('Invalid password or email');
	});

	it('fails if user is not found', async () => {
		event.request.formData.mockResolvedValue({
			get: (key) => (key === 'email' ? 'test@example.com' : 'password')
		});
		vi.spyOn(emailModule, 'verifyEmailInput').mockReturnValue(true);
		vi.spyOn(userModule, 'getUserFromEmail').mockResolvedValue(null);
		const result = await actions.signin(event);
		expect(result.status).toBe(400);
		expect(result.data.message).toBe('Invalid password or email');
	});

	it('fails if password is incorrect', async () => {
		event.request.formData.mockResolvedValue({
			get: (key) => (key === 'email' ? 'test@example.com' : 'password')
		});
		vi.spyOn(emailModule, 'verifyEmailInput').mockReturnValue(true);
		vi.spyOn(userModule, 'getUserFromEmail').mockResolvedValue({
			id: '1',
			isEmailGeverifieerd: true
		});
		vi.spyOn(userModule, 'getUserPasswordHash').mockResolvedValue('hash');
		vi.spyOn(passwordModule, 'verifyPasswordHash').mockResolvedValue(false);
		const result = await actions.signin(event);
		expect(result.status).toBe(400);
		expect(result.data.message).toMatch('Invalid password or email');
	});

	it('creates session and sets cookie on success', async () => {
		event.request.formData.mockResolvedValue({
			get: (key) => (key === 'email' ? 'test@example.com' : 'password')
		});
		vi.spyOn(emailModule, 'verifyEmailInput').mockReturnValue(true);
		vi.spyOn(userModule, 'getUserFromEmail').mockResolvedValue({
			id: '1',
			isEmailGeverifieerd: true
		});
		vi.spyOn(userModule, 'getUserPasswordHash').mockResolvedValue('hash');
		vi.spyOn(passwordModule, 'verifyPasswordHash').mockResolvedValue(true);
		vi.spyOn(sessionModule, 'generateSessionToken').mockReturnValue('token');
		vi.spyOn(sessionModule, 'createSession').mockResolvedValue({
			houdbaarTot: new Date(Date.now() + 10000)
		});
		const setSessionTokenCookie = vi
			.spyOn(sessionModule, 'setSessionTokenCookie')
			.mockImplementation(() => {});

		try {
			await actions.signin(event);
			throw new Error('Expected redirect to be thrown');
		} catch (e) {
			expect(e.status).toBe(302);
			expect(e.location).toBe('/');
		}

		expect(setSessionTokenCookie).toHaveBeenCalled();
	});
});
