import { fail, redirect } from '@sveltejs/kit';
import { checkEmailAvailability, verifyEmailInput, isValidEmailDomain } from '$lib/server/email';
import { createUser, verifyUsernameInput, checkUsernameAvailability } from '$lib/server/user';
import { verifyPasswordStrength, hashPassword } from '$lib/server/password';
import { createSession, generateSessionToken, setSessionTokenCookie } from '$lib/server/session';
import {
	createEmailVerificationRequest,
	sendVerificationEmail,
	setEmailVerificationRequestCookie
} from '$lib/server/email-verification';

export function load(event) {
	const { locals } = event;
	if (locals.sessie !== null && locals.gebruiker !== null) {
		if (!locals.gebruiker.isEmailGeverifieerd) {
			redirect(302, '/verify-email');
		}
		redirect(302, '/');
	}
	return {};
}

export const actions = {
	register: async (event) => {
		const formData = await event.request.formData();
		const email = formData.get('email');
		const username = formData.get('username');
		const password = formData.get('password');
		const confirmPassword = formData.get('confirm-password');

		if (typeof email !== 'string' || typeof username !== 'string' || typeof password !== 'string') {
			return fail(400, {
				message: 'Invalid or missing fields'
			});
		}

		if (password !== confirmPassword) {
			return fail(400, {
				message: 'Passwords do not match'
			});
		}

		if (email === '' || password === '' || username === '') {
			return fail(400, {
				message: 'Please enter your username, email, and password'
			});
		}

		if (!verifyEmailInput(email)) {
			return fail(400, {
				message: 'Invalid email'
			});
		}

		const validDomain = await isValidEmailDomain(email);
		if (!validDomain) {
			return fail(400, {
				message: 'Email domain is not allowed'
			});
		}

		const emailAvailable = await checkEmailAvailability(email);
		if (!emailAvailable) {
			return fail(400, {
				message: 'Email is already used'
			});
		}

		if (!verifyUsernameInput(username)) {
			return fail(400, {
				message: 'Invalid username'
			});
		}

		if (!(await checkUsernameAvailability(username))) {
			return fail(400, {
				message: 'Username is already taken'
			});
		}

		const strongPassword = await verifyPasswordStrength(password);
		if (!strongPassword.valid) {
			return fail(400, {
				message: strongPassword.message
			});
		}

		const hashedPassword = await hashPassword(password);
		const user = await createUser(email, username, hashedPassword);
		const emailVerificationRequest = await createEmailVerificationRequest(user.id);
		sendVerificationEmail(emailVerificationRequest.email, emailVerificationRequest.code);
		setEmailVerificationRequestCookie(event, emailVerificationRequest);
		const sessionToken = generateSessionToken();
		const session = await createSession(sessionToken, user.id);
		setSessionTokenCookie(event, sessionToken, session.houdbaarTot);

		redirect(302, '/verify-email');
	}
};
