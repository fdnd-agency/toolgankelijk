import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as emailModule from '$lib/server/email';
import * as userModule from '$lib/server/user';
import * as passwordModule from '$lib/server/password';
import * as sessionModule from '$lib/server/session';
import { actions, load } from '../../../src/routes/register/+page.server.js';

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
	verifyPasswordStrength: vi.fn()
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
		// Arrange
		const locals = {
			sessie: { id: '567ads567ads', houdbaarTot: new Date() },
			gebruiker: { id: 1, email: 'test@vervoerregio.nl', gebruikersnaam: 'John' }
		};

		// Act
		const callLoad = () => load({ locals });

		// Assert
		expect(callLoad).toThrow();
	});

	it('returns fail if passwords do not match', async () => {
		// Arrange
		event.request.formData.mockResolvedValue({
			get: (key) =>
				({
					email: 'test@vervoerregio.nl',
					username: 'John',
					password: 'T3$tT3$t',
					'confirm-password': 'T3$tT3$t22'
				}[key])
		});

		// Act
		const result = await actions.register(event);

		// Assert
		expect(result.status).toBe(400);
		expect(result.data.message).toBe('Passwords do not match');
	});

	it('returns fail if fields are not strings', async () => {
		// Arrange
		event.request.formData.mockResolvedValue({
			get: (key) =>
				({
					email: undefined,
					username: undefined,
					password: undefined,
					'confirm-password': undefined
				}[key])
		});

		// Act
		const result = await actions.register(event);

		// Assert
		expect(result.status).toBe(400);
		expect(result.data.message).toBe('Invalid or missing fields');
	});

	it('returns fail if fields are empty strings', async () => {
		// Arrange
		event.request.formData.mockResolvedValue({
			get: (key) => ({ email: '', username: '', password: '', 'confirm-password': '' }[key])
		});

		// Act
		const result = await actions.register(event);

		// Assert
		expect(result.status).toBe(400);
		expect(result.data.message).toBe('Please enter your username, email, and password');
	});

	it('returns fail if email is invalid', async () => {
		// Arrange
		event.request.formData.mockResolvedValue({
			get: (key) =>
				({ email: 'bad', username: 'John', password: 'T3$tT3$t', 'confirm-password': 'T3$tT3$t' }[
					key
				])
		});
		emailModule.verifyEmailInput.mockReturnValue(false);

		// Act
		const result = await actions.register(event);

		// Assert
		expect(result.status).toBe(400);
		expect(result.data.message).toBe('Invalid email');
	});

	it('returns fail if email domain is not allowed', async () => {
		// Arrange
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

		// Act
		const result = await actions.register(event);

		// Assert
		expect(result.status).toBe(400);
		expect(result.data.message).toBe('Email domain is not allowed');
	});

	it('returns fail if email is already used', async () => {
		// Arrange
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

		// Act
		const result = await actions.register(event);

		// Assert
		expect(result.status).toBe(400);
		expect(result.data.message).toBe('Email is already used');
	});

	it('returns fail if username is invalid', async () => {
		// Arrange
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

		// Act
		const result = await actions.register(event);

		// Assert
		expect(result.status).toBe(400);
		expect(result.data.message).toBe('Invalid username');
	});

	it('returns fail if username is already taken', async () => {
		// Arrange
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

		// Act
		const result = await actions.register(event);

		// Assert
		expect(result.status).toBe(400);
		expect(result.data.message).toBe('Username is already taken');
	});

	it('returns fail if password is not strong', async () => {
		// Arrange
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

		// Act
		const result = await actions.register(event);

		// Assert
		expect(result.status).toBe(400);
		expect(result.data.message).toBe('Weak password');
	});

	it('creates user and session on valid input', async () => {
		// Arrange
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
		userModule.createUser.mockResolvedValue({ id: 'user-id' });
		sessionModule.generateSessionToken.mockReturnValue('token');
		sessionModule.createSession.mockResolvedValue({ houdbaarTot: 'future-date' });

		// Act & Assert
		try {
			await actions.register(event);
			throw new Error('Expected redirect to be thrown');
		} catch (e) {
			expect(e.status).toBe(303);
			expect(e.location).toBe('/');
		}

		expect(userModule.createUser).toHaveBeenCalledWith('test@vervoerregio.nl', 'John', 'T3$tT3$t');
		expect(sessionModule.generateSessionToken).toHaveBeenCalled();
		expect(sessionModule.createSession).toHaveBeenCalledWith('token', 'user-id');
		expect(sessionModule.setSessionTokenCookie).toHaveBeenCalledWith(event, 'token', 'future-date');
	});
});
