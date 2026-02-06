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
	// Controleer of de gebruiker is ingelogd
	if (event.locals.gebruiker === null) {
		throw redirect(302, '/login');
	}

	// Controleer of de gebruiker zijn e-mail al heeft geverifieerd
	if (event.locals.gebruiker.isEmailGeverifieerd) {
		throw redirect(302, '/');
	}

	// Controleer of er een lopend e-mailverificatieverzoek is
	let verificationRequest = await getUserEmailVerificationRequestFromRequest(event);
	if (verificationRequest === null || Date.now() >= verificationRequest.expiresAt.getTime()) {
		verificationRequest = await createEmailVerificationRequest(event.locals.gebruiker.id);

		// Stuur een nieuwe verificatie-e-mail als het verzoek nieuw of verlopen is
		sendVerificationEmail(verificationRequest.email, verificationRequest.code);
		setEmailVerificationRequestCookie(event, verificationRequest);
	}

	// Geef het e-mailadres terug voor weergave op de pagina
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

// Deze functie handelt de verificatie van de door de gebruiker ingevoerde code af
async function verifyCode(event) {
	// Controleer of de gebruiker is ingelogd
	if (event.locals.sessie === null || event.locals.gebruiker === null) {
		return fail(401, {
			verify: {
				message: 'Niet geauthenticeerd'
			}
		});
	}

	// Haal het e-mailverificatieverzoek op en controleer of het bestaat
	let verificationRequest = await getUserEmailVerificationRequestFromRequest(event);
	if (verificationRequest === null) {
		return fail(401, {
			verify: {
				message: 'Niet geauthenticeerd'
			}
		});
	}

	// Haal de code uit de form data en valideer deze
	const formData = await event.request.formData();
	const code = formData.get('code');
	if (typeof code !== 'string') {
		return fail(400, {
			verify: {
				message: 'Ongeldige of ontbrekende velden'
			}
		});
	}
	if (code === '') {
		return fail(400, {
			verify: {
				message: 'Voer je code in'
			}
		});
	}

	// Controleer of de code correct is en niet verlopen
	if (Date.now() >= verificationRequest.expiresAt.getTime()) {
		verificationRequest = await createEmailVerificationRequest(event.locals.gebruiker.id);
		sendVerificationEmail(verificationRequest.email, verificationRequest.code);
		return {
			verify: {
				message: 'De verificatiecode is verlopen. We hebben een nieuwe code naar je inbox gestuurd.'
			}
		};
	}

	// Als de code onjuist is, geef een foutmelding
	if (verificationRequest.code !== code) {
		return fail(400, {
			verify: {
				message: 'Verkeerde code.'
			}
		});
	}

	// Als de code correct is, markeer het e-mailadres als geverifieerd en verwijder het verzoek en de cookie
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
	// Controleer of de gebruiker is ingelogd
	if (event.locals.sessie === null || event.locals.gebruiker === null) {
		return fail(401, {
			resend: {
				message: 'Niet geauthenticeerd'
			}
		});
	}

	// Controleer of de gebruiker zijn e-mail al heeft geverifieerd
	let verificationRequest = await getUserEmailVerificationRequestFromRequest(event);
	if (verificationRequest === null) {
		if (event.locals.gebruiker.isEmailGeverifieerd) {
			return fail(403, {
				resend: {
					message: 'Niet toegestaan'
				}
			});
		}
		verificationRequest = await createEmailVerificationRequest(event.locals.gebruiker.id);
	} else {
		verificationRequest = await createEmailVerificationRequest(event.locals.gebruiker.id);
	}

	// Stuur een nieuwe verificatie-e-mail en zet de cookie
	sendVerificationEmail(verificationRequest.email, verificationRequest.code);
	setEmailVerificationRequestCookie(event, verificationRequest);
	return {
		resend: {
			message: 'Er is een nieuwe code naar je inbox gestuurd.'
		}
	};
}
