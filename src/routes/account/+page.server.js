import { fail } from '@sveltejs/kit';
import { checkEmailAvailability, verifyEmailInput, isValidEmailDomain } from '$lib/server/email';
import { createUser, verifyUsernameInput, checkUsernameAvailability } from '$lib/server/user';
import { verifyPasswordStrength } from '$lib/server/password';
import { createSession, generateSessionToken, setSessionTokenCookie } from '$lib/server/session';

export const actions = {
	default: action
};

async function action(event) {
	const formData = await event.request.formData();
	const email = formData.get('email');
	const username = formData.get('username');
	const password = formData.get('password');
	const confirmPassword = formData.get('confirm-password');

	if (password !== confirmPassword) {
		return fail(400, {
			message: 'Passwords do not match',
			email,
			username
		});
	}

	if (typeof email !== 'string' || typeof username !== 'string' || typeof password !== 'string') {
		return fail(400, {
			message: 'Invalid or missing fields',
			email: '',
			username: ''
		});
	}

	if (email === '' || password === '' || username === '') {
		return fail(400, {
			message: 'Please enter your username, email, and password',
			email: '',
			username: ''
		});
	}

	if (!verifyEmailInput(email)) {
		return fail(400, {
			message: 'Invalid email',
			email,
			username
		});
	}

	const validDomain = await isValidEmailDomain(email);
	if (!validDomain) {
		return fail(400, {
			message: 'Email domain is not allowed',
			email,
			username
		});
	}

	const emailAvailable = await checkEmailAvailability(email);
	if (!emailAvailable) {
		return fail(400, {
			message: 'Email is already used',
			email,
			username
		});
	}

	if (!verifyUsernameInput(username)) {
		return fail(400, {
			message: 'Invalid username',
			email,
			username
		});
	}

	if (!(await checkUsernameAvailability(username))) {
		return fail(400, {
			message: 'Username is already taken',
			email,
			username
		});
	}

	const strongPassword = await verifyPasswordStrength(password);
	if (!strongPassword.valid) {
		return fail(400, {
			message: strongPassword.message,
			email,
			username
		});
	}

	const user = await createUser(email, username, password);
	const sessionToken = generateSessionToken();
	const session = await createSession(sessionToken, user.id);
	setSessionTokenCookie(event, sessionToken, session.houdbaarTot);
}
