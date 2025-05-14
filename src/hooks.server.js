import {
	validateSessionToken,
	setSessionTokenCookie,
	deleteSessionTokenCookie
} from '$lib/server/session';
import { sequence } from '@sveltejs/kit/hooks';

const authHandle = async ({ event, resolve }) => {
	event.locals.gebruiker = null;
	event.locals.sessie = null;

	const token = event.cookies.get('session') ?? null;
	if (token === null) {
		return resolve(event);
	}

	const { sessie, gebruiker } = await validateSessionToken(token);
	if (sessie !== null) {
		setSessionTokenCookie(event, token, sessie.houdbaarTot);
	} else {
		deleteSessionTokenCookie(event);
	}

	event.locals.sessie = sessie;
	event.locals.gebruiker = gebruiker;
	return resolve(event);
};

export const handle = sequence(authHandle);
