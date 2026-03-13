//@ts-check
import * as crypto from 'crypto';
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from '@oslojs/encoding';
import { sha256 } from '@oslojs/crypto/sha2';
import {
	getSessionByTokenHash,
	updateSessionExpiry,
	deleteSessionByID,
	createSessionRecord
} from '$lib/repositories/sessionRepository.js';

// Type definitions
/**
 * @typedef {import('$lib/types').Session} Session
 * @typedef {import('$lib/types').User} User
 * @typedef {import('@sveltejs/kit').RequestEvent} RequestEvent
 */

// Code
/**
 * Validates a Session token
 * @author Maksim Hofker
 * @author Bjarne Zeeman
 * @async
 * @param {String} token The session token to be validated
 * @returns {Promise<{ session: Session | null , user: User  | null }>}
 */
export async function validateSessionToken(token) {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const sessionRow = await getSessionByTokenHash(sessionId);

	if (
		!sessionRow ||
		!(sessionRow.session_id || sessionRow.id) ||
		!sessionRow.user_id?.id ||
		!sessionRow.expires_at
	) {
		return { session: null, user: null };
	}

	const sessionIdFromRow = sessionRow.session_id ?? sessionRow.id;
	const userIdFromRow = sessionRow.user_id.id;
	const expiresAtFromRow = sessionRow.expires_at;

	/** @type {Session | null} */
	let session = {
		id: sessionIdFromRow,
		userId: userIdFromRow,
		expiresAt: new Date(expiresAtFromRow)
	};

	/**
	 * @type {null | User}
	 */
	let user = null;
	const userNode = sessionRow.user_id;
	if (userNode) {
		user = {
			id: userNode.id,
			email: userNode.email,
			username: userNode.username,
			isEmailVerified: userNode.is_email_verified ?? false
		};
	}

	//Invalidate session if outdated Else Refresh session if old
	if (Date.now() >= session.expiresAt.getTime()) {
		({ session, user } = await invalidateSession(session));
	} else if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
		session = await refreshSession(session);
	}
	return { session, user };
}

/**
 * Deletes the given session from Hygraph.
 *
 * Note:
 * This function does NOT clear the session cookie.
 *
 * @async
 * @author Maksim Hofker
 * @author Bjarne Zeeman
 * @param {Session} session - The session to delete.
 * @returns {Promise<{ session: null, user: null }>} An object with nulled session and user values.
 */
async function invalidateSession(session) {
	await deleteSessionByID(session.id);
	return { session: null, user: null };
}

/**
 * Refreshes a session
 * @async
 * @author Maksim Hofker
 * @author Bjarne Zeeman
 * @param { Session } session - The session object to be refreshed
 * @returns {Promise<Session>} A session with a refreshed lifetime
 */
async function refreshSession(session) {
	session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
	await updateSessionExpiry({ sessionId: session.id, expiresAt: session.expiresAt });
	return session;
}

/**
 * Sets a session token cookie on the given event.
 *
 * @author Bjarne Zeeman
 * @param {RequestEvent} event - The request event containing cookies.
 * @param {string} token - The session token to store in the cookie.
 * @param {Date} expiresAt - The expiration date of the cookie.
 */
export function setSessionTokenCookie(event, token, expiresAt) {
	event.cookies.set('session', token, {
		httpOnly: true,
		path: '/',
		secure: import.meta.env.PROD,
		sameSite: 'lax',
		expires: expiresAt
	});
}

/**
 * Deletes a session token cookie on the given event.
 *
 * @author Maksim Hofker
 * @author Bjarne Zeeman
 * @param {RequestEvent} event - The request event containing cookies.
 */
export function deleteSessionTokenCookie(event) {
	event.cookies.delete('session', { path: '/' });
}

/**
 * Generates a session token
 *
 * @author Bjarne Zeeman
 * @returns {String} session token
 */
export function generateSessionToken() {
	const tokenBytes = crypto.randomBytes(20);
	const token = encodeBase32LowerCaseNoPadding(tokenBytes).toLowerCase();
	return token;
}

/**
 * Creates a new Session
 *
 * @author Bjarne Zeeman
 * @async
 * @param {String} token
 * @param {string} userId
 * @returns {Promise<Session>}
 */
export async function createSession(token, userId) {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
	const session = await createSessionRecord({ sessionId, userId, expiresAt });
	return session;
}
