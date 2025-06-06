import { fail, redirect } from '@sveltejs/kit';
import { verifyEmailInput } from '$lib/server/email';
import { getUserFromEmail, getUserPasswordHash } from '$lib/server/user';
import { verifyPasswordHash } from '$lib/server/password';
import { createSession, generateSessionToken, setSessionTokenCookie } from '$lib/server/session';

export function load(event) {
	const { locals } = event;
	if (locals.sessie !== null && locals.gebruiker !== null) {
		if (locals.gebruiker.isEmailGeverifieerd) {
			throw redirect(302, '/verify-email');
		}
		throw redirect(302, '/');
	}
	return {};
}

export const actions = {
	signin: async (event) => {
		const formData = await event.request.formData();
		const email = formData.get('email');
		const password = formData.get('password');

		if (typeof email !== 'string' || typeof password !== 'string') {
			return fail(400, {
				message: 'Invalid or missing fields',
				email: ''
			});
		}

		if (email === '' || password === '') {
			return fail(400, {
				message: 'Please enter your email and password',
				email
			});
		}

		if (!verifyEmailInput(email)) {
			return fail(400, {
				message: 'Invalid password or email',
				email
			});
		}

		const user = await getUserFromEmail(email);
		if (user === null) {
			return fail(400, {
				message: 'Invalid password or email',
				email
			});
		}

		const passwordHash = await getUserPasswordHash(user.id);
		const validPassword = await verifyPasswordHash(passwordHash, password);
		if (!validPassword) {
			return fail(400, {
				message: 'Invalid password or email',
				email
			});
		}

		const sessionToken = generateSessionToken();
		const session = await createSession(sessionToken, user.id);
		setSessionTokenCookie(event, sessionToken, session.houdbaarTot);

		if (!user.isEmailGeverifieerd) {
			throw redirect(302, '/verify-email');
		}
		throw redirect(302, '/');
	}
};
