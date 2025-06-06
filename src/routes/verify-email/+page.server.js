import { fail, redirect } from '@sveltejs/kit';
import {
	createEmailVerificationRequest,
	deleteEmailVerificationRequestCookie,
	deleteUserEmailVerificationRequest,
	getUserEmailVerificationRequestFromRequest,
	sendVerificationEmail,
	setEmailVerificationRequestCookie
} from '$lib/server/email-verification';
import { setUserEmailAsVerified } from '$lib/server/user';

export async function load(event) {
	if (event.locals.gebruiker === null) {
		throw redirect(302, '/login');
	}
	let verificationRequest = await getUserEmailVerificationRequestFromRequest(event);
	if (verificationRequest === null || Date.now() >= verificationRequest.expiresAt.getTime()) {
		if (event.locals.gebruiker.isEmailGeverifieerd) {
			throw redirect(302, '/');
		}
		verificationRequest = await createEmailVerificationRequest(
			event.locals.gebruiker.id,
			event.locals.gebruiker.email
		);
		sendVerificationEmail(verificationRequest.email, verificationRequest.code);
		setEmailVerificationRequestCookie(event, verificationRequest);
	}
	return {
		email: verificationRequest.email
	};
}

export const actions = {
	verify: verifyCode,
	resend: resendEmail
};

async function verifyCode(event) {
	if (event.locals.sessie === null || event.locals.gebruiker === null) {
		return fail(401, {
			verify: {
				message: 'Not authenticated'
			}
		});
	}

	let verificationRequest = await getUserEmailVerificationRequestFromRequest(event);
	if (verificationRequest === null) {
		return fail(401, {
			verify: {
				message: 'Not authenticated'
			}
		});
	}
	const formData = await event.request.formData();
	const code = formData.get('code');
	if (typeof code !== 'string') {
		return fail(400, {
			verify: {
				message: 'Invalid or missing fields'
			}
		});
	}
	if (code === '') {
		return fail(400, {
			verify: {
				message: 'Enter your code'
			}
		});
	}
	if (Date.now() >= verificationRequest.expiresAt.getTime()) {
		verificationRequest = await createEmailVerificationRequest(
			verificationRequest.userId,
			verificationRequest.email
		);
		sendVerificationEmail(verificationRequest.email, verificationRequest.code);
		return {
			verify: {
				message: 'The verification code was expired. We sent another code to your inbox.'
			}
		};
	}
	if (verificationRequest.code !== code) {
		return fail(400, {
			verify: {
				message: 'Incorrect code.'
			}
		});
	}
	deleteUserEmailVerificationRequest(event.locals.gebruiker.id);
	setUserEmailAsVerified(event.locals.gebruiker.id, verificationRequest.email);
	deleteEmailVerificationRequestCookie(event);

	event.cookies.set('show_registration_success', '1', {
		path: '/',
		httpOnly: false,
		maxAge: 60
	});

	throw redirect(302, '/');
}

async function resendEmail(event) {
	if (event.locals.sessie === null || event.locals.gebruiker === null) {
		return fail(401, {
			resend: {
				message: 'Not authenticated'
			}
		});
	}

	let verificationRequest = await getUserEmailVerificationRequestFromRequest(event);
	if (verificationRequest === null) {
		if (event.locals.gebruiker.isEmailGeverifieerd) {
			return fail(403, {
				resend: {
					message: 'Forbidden'
				}
			});
		}
		verificationRequest = await createEmailVerificationRequest(
			event.locals.gebruiker.id,
			event.locals.gebruiker.email
		);
	} else {
		verificationRequest = await createEmailVerificationRequest(
			event.locals.gebruiker.id,
			verificationRequest.email
		);
	}
	sendVerificationEmail(verificationRequest.email, verificationRequest.code);
	setEmailVerificationRequestCookie(event, verificationRequest);
	return {
		resend: {
			message: 'A new code was sent to your inbox.'
		}
	};
}
