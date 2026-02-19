//@ts-check
import * as crypto from 'crypto';
import { hygraph } from '$lib/utils/hygraph.js';
import { gql } from 'graphql-request';
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from '@oslojs/encoding';
import { sha256 } from '@oslojs/crypto/sha2';

// Type definitions
/**
 * @typedef {Object} Session
 * @property {string|null} id
 * @property {string|null} gebruikerId
 * @property {Date} houdbaarTot
 */
/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} email
 * @property {string} gebruikersnaam
 * @property {boolean} isEmailGeverifieerd
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
	const sessionQuery = gql`
		query GetSessie($sessionId: String!) {
			sessie(where: { sessieId: $sessionId }) {
				id
				sessieId
				houdbaarTot
				gebruikerId {
					id
					email
					gebruikersnaam
					isEmailGeverifieerd
				}
			}
		}
	`;
	const sessionData = await hygraph.request(sessionQuery, { sessionId });
	const row = sessionData.sessie;

	if (!row) {
		return { session: null, user: null };
	}

	/**
	 * @type {Session}
	 */
	let session = {
		id: row.sessieId,
		gebruikerId: row.gebruikerId.id,
		houdbaarTot: new Date(row.houdbaarTot)
	};

	/**
	 * @type {null | User}
	 */
	let user = null;
	if (row.gebruikerId) {
		user = {
			id: row.gebruikerId.id,
			email: row.gebruikerId.email,
			gebruikersnaam: row.gebruikerId.gebruikersnaam,
			isEmailGeverifieerd: row.gebruikerId.isEmailGeverifieerd
		};
	}

	//Invalidate session if outdated
	if (Date.now() >= session.houdbaarTot.getTime()) {
		({ session, user } = await invalidateSession(session));
	}
	//Refresh session if old
	if (Date.now() >= session.houdbaarTot.getTime() - 1000 * 60 * 60 * 24 * 15) {
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
export async function invalidateSession(session) {
	// Delete session mutation
	const deleteMutation = gql`
		mutation DeleteSessie($id: ID!) {
			deleteSessie(where: { sessieId: $id }) {
				id
			}
		}
	`;
	await hygraph.request(deleteMutation, { id: session.id });
	return { session: null, user: null };
}

/**
 * Refreshes a session
 *
 * @async
 * @author Maksim Hofker
 * @author Bjarne Zeeman
 * @param { Session } session - The session object to be refreshed
 * @returns {Promise<Session>} A session with a refreshed lifetime
 */
export async function refreshSession(session) {
	session.houdbaarTot = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
	// Update session mutation
	const updateMutation = gql`
		mutation UpdateSessie($id: String!, $expiresAt: Date!) {
			updateSessie(where: { sessieId: $id }, data: { houdbaarTot: $expiresAt }) {
				id
			}
		}
	`;
	await hygraph.request(updateMutation, {
		id: session.id,
		expiresAt: new Date(Math.floor(session.houdbaarTot.getTime() / 1000))
	});
	return session;
}

export function setSessionTokenCookie(event, token, houdbaarTot) {
	event.cookies.set('session', token, {
		httpOnly: true,
		path: '/',
		secure: import.meta.env.PROD,
		sameSite: 'lax',
		expires: houdbaarTot
	});
}

export function deleteSessionTokenCookie(event) {
	event.cookies.set('session', '', {
		httpOnly: true,
		path: '/',
		secure: import.meta.env.PROD,
		sameSite: 'lax',
		maxAge: 0
	});
}

export function generateSessionToken() {
	const tokenBytes = crypto.randomBytes(20);
	const token = encodeBase32LowerCaseNoPadding(tokenBytes).toLowerCase();
	return token;
}

export async function createSession(token, gebruikerId) {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const session = {
		id: sessionId,
		gebruikerId,
		houdbaarTot: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
	};
	const createMutation = gql`
		mutation CreateSessie($userId: ID!, $expiresAt: Date!, $sessionId: String!) {
			createSessie(
				data: {
					sessieId: $sessionId
					gebruikerId: { connect: { id: $userId } }
					houdbaarTot: $expiresAt
				}
			) {
				id
			}
		}
	`;
	await hygraph.request(createMutation, {
		userId: session.gebruikerId,
		expiresAt: session.houdbaarTot.toISOString(),
		sessionId: session.id
	});
	return session;
}
