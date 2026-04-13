//@ts-check
import * as crypto from 'crypto';
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from '@oslojs/encoding';
import { sha256 } from '@oslojs/crypto/sha2';
import { sessionRepository } from '$lib/server/index.js';

// Type definitions
/**
 * @typedef {import('$lib/types').Session} Session
 * @typedef {import('$lib/types').User} User
 * @typedef {import('@sveltejs/kit').RequestEvent} RequestEvent
 */

/**
 * This class is responsible for all session related operations
 */
export class SessionService {
	/**
	 * Validates a Session token
	 * @async
	 * @param {String} token The session token to be validated
	 * @returns {Promise<{ session: Session | null , user: User  | null }>}
	 */
	async validateSessionToken(token) {
		const sessionData = await sessionRepository.getSessionByTokenHash(
			encodeHexLowerCase(sha256(new TextEncoder().encode(token)))
		);
		if (!sessionData) {
			return { session: null, user: null };
		}

		let { session, user } = sessionData;

		// Invalidate session if outdated Else refresh if old.
		if (Date.now() >= session.expiresAt.getTime()) {
			return this.invalidateSession(session);
		} else if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
			session = await this.refreshSession(session);
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
	 * @param {Session} session - The session to delete.
	 * @returns {Promise<{ session: null, user: null }>} An object with nulled session and user values.
	 */
	async invalidateSession(session) {
		await sessionRepository.deleteSessionById(session.id);
		return { session: null, user: null };
	}

	/**
	 * Refreshes a session
	 * @async
	 * @param { Session } session - The session object to be refreshed
	 * @returns {Promise<Session>} A session with a refreshed lifetime
	 */
	async refreshSession(session) {
		session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
		await sessionRepository.updateSessionExpiry({
			sessionId: session.id,
			expiresAt: session.expiresAt
		});
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
	setSessionTokenCookie(event, token, expiresAt) {
		event.cookies.set('session', token, {
			httpOnly: true,
			path: '/',
			secure: import.meta.env.PROD,
			sameSite: 'lax',
			expires: expiresAt
		});
	}

	/**
	 * Creates a session and sets the session cookie.
	 *
	 * @param {RequestEvent} event - The request event containing cookies.
	 * @param {string} userId - The user id for the new session.
	 * @returns {Promise<Session>}
	 */
	async createAndSetSession(event, userId) {
		const sessionToken = this.#generateSessionToken();
		const session = await this.#createSession(sessionToken, userId);
		this.setSessionTokenCookie(event, sessionToken, session.expiresAt);
		return session;
	}

	/**
	 * Deletes a session from DB and clears the local session cookie.
	 *
	 * @param {RequestEvent} event - The request event containing cookies.
	 */
	async DeleteSession(event) {
		const token = event.cookies.get('session');
		if (!token) { //
			event.cookies.delete('session', { path: '/' });
			return;
		}

		const sessionRow = await sessionRepository.getSessionByTokenHash(
			encodeHexLowerCase(sha256(new TextEncoder().encode(token)))
		);
		if (sessionRow?.session) {
			await this.invalidateSession(sessionRow.session);
		}

		event.cookies.delete('session', { path: '/' });
	}

	/**
	 * Generates a session token
	 *
	 * @returns {String} session token
	 */
	#generateSessionToken() {
		const tokenBytes = crypto.randomBytes(20);
		const token = encodeBase32LowerCaseNoPadding(tokenBytes).toLowerCase();
		return token;
	}

	/**
	 * Creates a new Session
	 *
	 * @async
	 * @param {String} token
	 * @param {string} userId
	 * @returns {Promise<Session>}
	 */
	async #createSession(token, userId) {
		const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
		const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
		return sessionRepository.createSessionRecord({ sessionId, userId, expiresAt });
	}
}

export const sessionService = new SessionService();
