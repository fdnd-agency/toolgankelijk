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
	// Check if the user is authenticated
	if (event.locals.gebruiker === null) {
		throw redirect(302, '/login');
	}

	// Check if the user has already verified their email
	if (event.locals.gebruiker.isEmailGeverifieerd) {
		throw redirect(302, '/');
	}

	// Check if the user has a pending email verification request
	let verificationRequest = await getUserEmailVerificationRequestFromRequest(event);
	if (verificationRequest === null || Date.now() >= verificationRequest.expiresAt.getTime()) {
		verificationRequest = await createEmailVerificationRequest(
			event.locals.gebruiker.id,
			event.locals.gebruiker.email
		);

		// Send a new verification email if the request is new or expired
		sendVerificationEmail(verificationRequest.email, verificationRequest.code);
		setEmailVerificationRequestCookie(event, verificationRequest);
	}

	// Return the email to the page for display
	return {
		email: verificationRequest.email
	};
}

export const actions = {
	verify: verifyCode,
	resend: resendEmail
};

function delay(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

// This function handles the verification of the code entered by the user
async function verifyCode(event) {
	// Check if the user is authenticated
	if (event.locals.sessie === null || event.locals.gebruiker === null) {
		return fail(401, {
			verify: {
				message: 'Not authenticated'
			}
		});
	}

	// Get the email verification request from the event and check if it exists
	let verificationRequest = await getUserEmailVerificationRequestFromRequest(event);
	if (verificationRequest === null) {
		return fail(401, {
			verify: {
				message: 'Not authenticated'
			}
		});
	}

	// Get the code from the form data and validate it
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

	// Check if the code is correct and not expired
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

	// If the code is incorrect, return an error
	if (verificationRequest.code !== code) {
		return fail(400, {
			verify: {
				message: 'Incorrect code.'
			}
		});
	}

	// If the code is correct, set the user's email as verified and delete the verification request and cookie
	await deleteUserEmailVerificationRequest(event.locals.gebruiker.id);
	await setUserEmailAsVerified(event.locals.gebruiker.id, verificationRequest.email);
	deleteEmailVerificationRequestCookie(event);

	await delay(500);

	event.cookies.set('show_registration_success', '1', {
		path: '/',
		httpOnly: false,
		maxAge: 60
	});

	throw redirect(302, '/');
}

async function resendEmail(event) {
	// Check if the user is authenticated
	if (event.locals.sessie === null || event.locals.gebruiker === null) {
		return fail(401, {
			resend: {
				message: 'Not authenticated'
			}
		});
	}

	// Check if the user has already verified their email
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

	// Send a new verification email and set the cookie
	sendVerificationEmail(verificationRequest.email, verificationRequest.code);
	setEmailVerificationRequestCookie(event, verificationRequest);
	return {
		resend: {
			message: 'A new code was sent to your inbox.'
		}
	};
}
