import { sessionService } from '$lib/server/session';

export async function handle({ event, resolve }) {
	event.locals.user = null;
	event.locals.session = null;

	const token = event.cookies.get('session') ?? null;
	if (token === null) {
		return resolve(event);
	}

	const { session, user } = await sessionService.validateSessionToken(token);
	if (session !== null) {
		sessionService.setSessionTokenCookie(event, token, session.expiresAt);
	} else {
		await sessionService.DeleteSession(event);
	}

	event.locals.session = session;
	event.locals.user = user;
	return resolve(event);
}
