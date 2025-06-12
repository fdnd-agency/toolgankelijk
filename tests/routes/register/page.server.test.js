import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as emailModule from '$lib/server/email';
import * as userModule from '$lib/server/user';
import * as passwordModule from '$lib/server/password';
import * as sessionModule from '$lib/server/session';
import { actions, load } from '../../../src/routes/register/+page.server.js';

vi.mock('@sveltejs/kit', () => ({
	fail: (status, data) => ({ status, data }),
	redirect: (status, location) => {
		const err = new Error('Redirect');
		err.status = status;
		err.location = location;
		throw err;
	}
}));
vi.mock('$lib/server/email-verification', () => ({
	createEmailVerificationRequest: vi.fn().mockResolvedValue({
		id: 'verification-id',
		userId: 'user-id',
		code: '123456',
		email: 'test@vervoerregio.nl',
		expiresAt: new Date(Date.now() + 600000)
	}),
	sendVerificationEmail: vi.fn(),
	setEmailVerificationRequestCookie: vi.fn()
}));
vi.mock('$lib/server/email', () => ({
	checkEmailAvailability: vi.fn(),
	verifyEmailInput: vi.fn(),
	isValidEmailDomain: vi.fn()
}));
vi.mock('$lib/server/user', () => ({
	createUser: vi.fn(),
	verifyUsernameInput: vi.fn(),
	checkUsernameAvailability: vi.fn()
}));
vi.mock('$lib/server/password', () => ({
	verifyPasswordStrength: vi.fn(),
	hashPassword: vi.fn()
}));
vi.mock('$lib/server/session', () => ({
	createSession: vi.fn(),
	generateSessionToken: vi.fn(),
	setSessionTokenCookie: vi.fn()
}));

describe('src/routes/register/+page.server.js', () => {
	let event;

	beforeEach(() => {
		event = {
			request: {
				formData: vi.fn()
			},
			locals: { sessie: null, gebruiker: null },
			cookies: { set: vi.fn() }
		};
		vi.clearAllMocks();
	});

	it('redirects if user is already logged in', () => {
		const locals = {
			sessie: { id: '567ads567ads', houdbaarTot: new Date() },
			gebruiker: { id: 1, email: 'test@vervoerregio.nl', gebruikersnaam: 'John' }
		};
		const callLoad = () => load({ locals });
		expect(callLoad).toThrow();
	});

	it('returns fail if passwords do not match', async () => {
		event.request.formData.mockResolvedValue({
			get: (key) =>
				({
					email: 'test@vervoerregio.nl',
					username: 'John',
					password: 'T3$tT3$t',
					'confirm-password': 'T3$tT3$t22'
				}[key])
		});
		const result = await actions.register(event);
		expect(result.status).toBe(400);
		expect(result.data.message).toBe('Passwords do not match');
	});

	it('returns fail if fields are not strings', async () => {
		event.request.formData.mockResolvedValue({
			get: (key) =>
				({
					email: undefined,
					username: undefined,
					password: undefined,
					'confirm-password': undefined
				}[key])
		});
		const result = await actions.register(event);
		expect(result.status).toBe(400);
		expect(result.data.message).toBe('Invalid or missing fields');
	});

	it('returns fail if fields are empty strings', async () => {
		event.request.formData.mockResolvedValue({
			get: (key) => ({ email: '', username: '', password: '', 'confirm-password': '' }[key])
		});
		const result = await actions.register(event);
		expect(result.status).toBe(400);
		expect(result.data.message).toBe('Please enter your username, email, and password');
	});

	it('returns fail if email is invalid', async () => {
		event.request.formData.mockResolvedValue({
			get: (key) =>
				({ email: 'bad', username: 'John', password: 'T3$tT3$t', 'confirm-password': 'T3$tT3$t' }[
					key
				])
		});
		emailModule.verifyEmailInput.mockReturnValue(false);
		const result = await actions.register(event);
		expect(result.status).toBe(400);
		expect(result.data.message).toBe('Invalid email');
	});

	it('returns fail if email domain is not allowed', async () => {
		event.request.formData.mockResolvedValue({
			get: (key) =>
				({
					email: 'test@mail.com',
					username: 'John',
					password: 'T3$tT3$t',
					'confirm-password': 'T3$tT3$t'
				}[key])
		});
		emailModule.verifyEmailInput.mockReturnValue(true);
		emailModule.isValidEmailDomain.mockResolvedValue(false);
		const result = await actions.register(event);
		expect(result.status).toBe(400);
		expect(result.data.message).toBe('Email domain is not allowed');
	});

	it('returns fail if email is already used', async () => {
		event.request.formData.mockResolvedValue({
			get: (key) =>
				({
					email: 'test@mail.com',
					username: 'John',
					password: 'T3$tT3$t',
					'confirm-password': 'T3$tT3$t'
				}[key])
		});
		emailModule.verifyEmailInput.mockReturnValue(true);
		emailModule.isValidEmailDomain.mockResolvedValue(true);
		emailModule.checkEmailAvailability.mockResolvedValue(false);
		const result = await actions.register(event);
		expect(result.status).toBe(400);
		expect(result.data.message).toBe('Email is already used');
	});

	it('returns fail if username is invalid', async () => {
		event.request.formData.mockResolvedValue({
			get: (key) =>
				({
					email: 'test@vervoerregio.nl',
					username: 'bad',
					password: 'T3$tT3$t',
					'confirm-password': 'T3$tT3$t'
				}[key])
		});
		emailModule.verifyEmailInput.mockReturnValue(true);
		emailModule.isValidEmailDomain.mockResolvedValue(true);
		emailModule.checkEmailAvailability.mockResolvedValue(true);
		userModule.verifyUsernameInput.mockReturnValue(false);
		const result = await actions.register(event);
		expect(result.status).toBe(400);
		expect(result.data.message).toBe('Invalid username');
	});

	it('returns fail if username is already taken', async () => {
		event.request.formData.mockResolvedValue({
			get: (key) =>
				({
					email: 'test@vervoerregio.nl',
					username: 'John',
					password: 'T3$tT3$t',
					'confirm-password': 'T3$tT3$t'
				}[key])
		});
		emailModule.verifyEmailInput.mockReturnValue(true);
		emailModule.isValidEmailDomain.mockResolvedValue(true);
		emailModule.checkEmailAvailability.mockResolvedValue(true);
		userModule.verifyUsernameInput.mockReturnValue(true);
		userModule.checkUsernameAvailability.mockResolvedValue(false);
		const result = await actions.register(event);
		expect(result.status).toBe(400);
		expect(result.data.message).toBe('Username is already taken');
	});

	it('returns fail if password is not strong', async () => {
		event.request.formData.mockResolvedValue({
			get: (key) =>
				({
					email: 'test@vervoerregio.nl',
					username: 'John',
					password: 'pass',
					'confirm-password': 'pass'
				}[key])
		});
		emailModule.verifyEmailInput.mockReturnValue(true);
		emailModule.isValidEmailDomain.mockResolvedValue(true);
		emailModule.checkEmailAvailability.mockResolvedValue(true);
		userModule.verifyUsernameInput.mockReturnValue(true);
		userModule.checkUsernameAvailability.mockResolvedValue(true);
		passwordModule.verifyPasswordStrength.mockResolvedValue({
			valid: false,
			message: 'Weak password'
		});
		const result = await actions.register(event);
		expect(result.status).toBe(400);
		expect(result.data.message).toBe('Weak password');
	});

	it('creates user and session on valid input', async () => {
		event.request.formData.mockResolvedValue({
			get: (key) =>
				({
					email: 'test@vervoerregio.nl',
					username: 'John',
					password: 'T3$tT3$t',
					'confirm-password': 'T3$tT3$t'
				}[key])
		});
		emailModule.verifyEmailInput.mockReturnValue(true);
		emailModule.isValidEmailDomain.mockResolvedValue(true);
		emailModule.checkEmailAvailability.mockResolvedValue(true);
		userModule.verifyUsernameInput.mockReturnValue(true);
		userModule.checkUsernameAvailability.mockResolvedValue(true);
		passwordModule.verifyPasswordStrength.mockResolvedValue({ valid: true });
		passwordModule.hashPassword.mockResolvedValue('hashed-password');
		userModule.createUser.mockResolvedValue({ id: 'user-id', email: 'test@vervoerregio.nl' });
		sessionModule.generateSessionToken.mockReturnValue('token');
		sessionModule.createSession.mockResolvedValue({ houdbaarTot: 'future-date' });

		try {
			await actions.register(event);
			throw new Error('Expected redirect to be thrown');
		} catch (e) {
			if (e && e.status === 302 && e.location === '/verify-email') {
				expect(e.status).toBe(302);
				expect(e.location).toBe('/verify-email');
			} else {
				throw e;
			}
		}

		expect(userModule.createUser).toHaveBeenCalledWith(
			'test@vervoerregio.nl',
			'John',
			'hashed-password'
		);
		expect(sessionModule.generateSessionToken).toHaveBeenCalled();
		expect(sessionModule.createSession).toHaveBeenCalledWith('token', 'user-id');
		expect(sessionModule.setSessionTokenCookie).toHaveBeenCalledWith(event, 'token', 'future-date');
	});
});
